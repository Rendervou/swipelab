import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_ANALYSIS_TYPES = ["general", "colors", "layout", "variations"] as const;
type AnalysisType = typeof ALLOWED_ANALYSIS_TYPES[number];

const RATE_LIMIT_MAX = 10; // max requests per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function validateInput(body: unknown): { imageUrl: string; analysisType: AnalysisType; customPrompt?: string } | string {
  if (!body || typeof body !== "object") return "Invalid request body";
  const { imageUrl, analysisType, customPrompt } = body as Record<string, unknown>;

  if (typeof imageUrl !== "string" || imageUrl.length === 0 || imageUrl.length > 2048) {
    return "imageUrl must be a non-empty string (max 2048 chars)";
  }
  try {
    const url = new URL(imageUrl);
    if (!["http:", "https:"].includes(url.protocol)) return "imageUrl must use http or https protocol";
  } catch {
    return "imageUrl must be a valid URL";
  }

  if (!ALLOWED_ANALYSIS_TYPES.includes(analysisType as AnalysisType)) {
    return `analysisType must be one of: ${ALLOWED_ANALYSIS_TYPES.join(", ")}`;
  }

  if (customPrompt !== undefined && customPrompt !== null) {
    if (typeof customPrompt !== "string" || customPrompt.length > 500) {
      return "customPrompt must be a string (max 500 chars)";
    }
  }

  return { imageUrl: imageUrl as string, analysisType: analysisType as AnalysisType, customPrompt: customPrompt as string | undefined };
}

const systemPrompts: Record<string, string> = {
  general: `You are an expert UI/UX design analyst. Analyze the provided design image and provide comprehensive feedback.
    
Your analysis must include:
1. **UX Score** (0-100): Rate the overall user experience
2. **Strengths** (exactly 3): Key positive aspects of the design
3. **Weaknesses** (exactly 3): Areas that need improvement
4. **Suggestion**: One actionable improvement tip

Respond in this exact JSON format:
{
  "ux_score": number,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "suggestion": "Your main improvement suggestion here"
}`,

  colors: `You are an expert color theory analyst. Analyze the color palette used in this design.

Provide:
1. **Main Colors**: List the primary colors used (with hex codes if possible)
2. **Color Harmony**: Assess if the colors work well together
3. **Accessibility**: Comment on color contrast and readability
4. **Mood**: What emotions do the colors evoke?
5. **Recommendations**: Suggest color improvements

Respond in this exact JSON format:
{
  "main_colors": [{"name": "color name", "hex": "#000000", "usage": "how it's used"}],
  "harmony_score": number (0-100),
  "harmony_analysis": "Analysis of color harmony",
  "accessibility_notes": "Notes on color accessibility",
  "mood": "Description of the mood/emotions",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`,

  layout: `You are an expert UI layout analyst. Review the layout and visual hierarchy of this design.

Analyze:
1. **Visual Hierarchy**: How well information is prioritized
2. **Spacing & Balance**: Use of whitespace and element distribution
3. **Grid System**: Consistency in layout structure
4. **Flow**: Natural eye movement and user journey
5. **Responsiveness Potential**: How it might adapt to different screens

Respond in this exact JSON format:
{
  "hierarchy_score": number (0-100),
  "hierarchy_analysis": "Analysis of visual hierarchy",
  "spacing_analysis": "Analysis of spacing and balance",
  "grid_analysis": "Analysis of grid and structure",
  "flow_analysis": "Analysis of visual flow",
  "responsiveness_notes": "Notes on responsiveness",
  "improvements": ["improvement1", "improvement2", "improvement3"]
}`,

  variations: `You are a creative design consultant. Based on this design, suggest variations and alternative approaches.

Provide:
1. **Style Variations**: Different visual styles that could work
2. **Layout Alternatives**: Different ways to arrange the content
3. **Color Variations**: Alternative color schemes
4. **Trend Suggestions**: Modern design trends that could be applied

Respond in this exact JSON format:
{
  "style_variations": [{"name": "variation name", "description": "what it would look like"}],
  "layout_alternatives": [{"name": "layout name", "description": "how it would be arranged"}],
  "color_variations": [{"name": "scheme name", "colors": ["#color1", "#color2"], "mood": "the mood it creates"}],
  "trend_suggestions": [{"trend": "trend name", "application": "how to apply it"}]
}`
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    // Create Supabase client with user context
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated using getClaims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabaseClient.auth.getClaims(token);
    
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub as string;

    // --- Rate limiting ---
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    const { count, error: countError } = await adminClient
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('function_name', 'analyze-design')
      .gte('created_at', windowStart);

    if (countError) {
      console.error('Rate limit check error:', countError);
    } else if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later (max 10 requests per hour).' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record this request
    await adminClient.from('rate_limits').insert({ user_id: userId, function_name: 'analyze-design' });

    // --- Input validation ---
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validationResult = validateInput(body);
    if (typeof validationResult === "string") {
      return new Response(
        JSON.stringify({ error: validationResult }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { imageUrl, analysisType, customPrompt } = validationResult;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = systemPrompts[analysisType] || systemPrompts.general;
    const userPrompt = customPrompt 
      ? `${customPrompt}\n\nPlease analyze this design image.`
      : "Please analyze this design image.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "API credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze design");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON from the response
    let analysisResult;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      analysisResult = JSON.parse(jsonStr);
    } catch {
      analysisResult = { raw_response: content };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      analysisType,
      result: analysisResult 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(JSON.stringify({ 
      error: "An internal error occurred. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
