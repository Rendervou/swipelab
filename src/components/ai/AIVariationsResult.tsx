import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, LayoutGrid, Palette, TrendingUp } from 'lucide-react';

interface StyleVariation {
  name: string;
  description: string;
}

interface LayoutAlternative {
  name: string;
  description: string;
}

interface ColorVariation {
  name: string;
  colors: string[];
  mood: string;
}

interface TrendSuggestion {
  trend: string;
  application: string;
}

interface VariationsResult {
  style_variations?: StyleVariation[];
  layout_alternatives?: LayoutAlternative[];
  color_variations?: ColorVariation[];
  trend_suggestions?: TrendSuggestion[];
  raw_response?: string;
}

interface AIVariationsResultProps {
  result: VariationsResult;
}

export const AIVariationsResult = ({ result }: AIVariationsResultProps) => {
  if (result.raw_response) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap">{result.raw_response}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Style Variations */}
      {result.style_variations && result.style_variations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wand2 className="h-5 w-5 text-lavender" />
              Style Variations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {result.style_variations.map((variation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-muted/50"
              >
                <h4 className="font-medium text-sm mb-1">{variation.name}</h4>
                <p className="text-xs text-muted-foreground">{variation.description}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Layout Alternatives */}
      {result.layout_alternatives && result.layout_alternatives.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutGrid className="h-5 w-5 text-electric-blue" />
              Layout Alternatives
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {result.layout_alternatives.map((layout, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-muted/50"
              >
                <h4 className="font-medium text-sm mb-1">{layout.name}</h4>
                <p className="text-xs text-muted-foreground">{layout.description}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Color Variations */}
      {result.color_variations && result.color_variations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-5 w-5 text-mint" />
              Color Variations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {result.color_variations.map((colorVar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{colorVar.name}</h4>
                  <div className="flex gap-1">
                    {colorVar.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-6 h-6 rounded border shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{colorVar.mood}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Trend Suggestions */}
      {result.trend_suggestions && result.trend_suggestions.length > 0 && (
        <Card className="bg-gradient-hero border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-gold" />
              Trending Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {result.trend_suggestions.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-1"
              >
                <Badge variant="secondary" className="mb-1">{trend.trend}</Badge>
                <p className="text-xs text-muted-foreground">{trend.application}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
