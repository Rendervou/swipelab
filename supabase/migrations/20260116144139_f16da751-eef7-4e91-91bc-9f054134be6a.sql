-- Fix 1: Add INSERT policy for ai_feedback table (design owners can request AI feedback for their designs)
CREATE POLICY "Design owners can insert AI feedback for their designs"
ON public.ai_feedback FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = ai_feedback.design_id
    AND designs.user_id = auth.uid()
  )
);

-- Fix 2: Drop the overly permissive profiles SELECT policy and replace with authenticated-only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Fix 3: Drop the overly permissive designs SELECT policy and replace with authenticated-only
DROP POLICY IF EXISTS "Anyone can view designs" ON public.designs;

CREATE POLICY "Authenticated users can view designs"
ON public.designs FOR SELECT
TO authenticated
USING (true);

-- Fix 4: Update ai_feedback SELECT policies to require authentication
DROP POLICY IF EXISTS "Anyone can view AI feedback for any design" ON public.ai_feedback;

CREATE POLICY "Authenticated users can view AI feedback"
ON public.ai_feedback FOR SELECT
TO authenticated
USING (true);