import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Palette, Eye, Heart, Lightbulb } from 'lucide-react';

interface ColorInfo {
  name: string;
  hex: string;
  usage: string;
}

interface ColorsResult {
  main_colors?: ColorInfo[];
  harmony_score?: number;
  harmony_analysis?: string;
  accessibility_notes?: string;
  mood?: string;
  recommendations?: string[];
  raw_response?: string;
}

interface AIColorsResultProps {
  result: ColorsResult;
}

export const AIColorsResult = ({ result }: AIColorsResultProps) => {
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
      {/* Color Palette */}
      {result.main_colors && result.main_colors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-5 w-5 text-lavender" />
              Color Palette
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3">
              {result.main_colors.map((color, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div 
                    className="w-12 h-12 rounded-lg shadow-md shrink-0 border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{color.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{color.hex}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{color.usage}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Harmony Score */}
      {result.harmony_score !== undefined && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-5 w-5 text-coral" />
                Color Harmony
              </CardTitle>
              <span className="font-display text-2xl font-bold text-primary">
                {result.harmony_score}%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={result.harmony_score} className="h-2 mb-3" />
            {result.harmony_analysis && (
              <p className="text-sm text-muted-foreground">{result.harmony_analysis}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Accessibility */}
      {result.accessibility_notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-5 w-5 text-electric-blue" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm">{result.accessibility_notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Mood */}
      {result.mood && (
        <Card className="bg-gradient-hero border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Mood & Emotion</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm">{result.mood}</p>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-5 w-5 text-gold" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 shrink-0" />
                  {rec}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
