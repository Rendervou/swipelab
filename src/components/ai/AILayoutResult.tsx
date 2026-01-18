import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LayoutGrid, Layers, Grid3X3, Move, Smartphone, Lightbulb } from 'lucide-react';

interface LayoutResult {
  hierarchy_score?: number;
  hierarchy_analysis?: string;
  spacing_analysis?: string;
  grid_analysis?: string;
  flow_analysis?: string;
  responsiveness_notes?: string;
  improvements?: string[];
  raw_response?: string;
}

interface AILayoutResultProps {
  result: LayoutResult;
}

export const AILayoutResult = ({ result }: AILayoutResultProps) => {
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
      {/* Hierarchy Score */}
      {result.hierarchy_score !== undefined && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-5 w-5 text-electric-blue" />
                Visual Hierarchy
              </CardTitle>
              <span className="font-display text-2xl font-bold text-primary">
                {result.hierarchy_score}%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={result.hierarchy_score} className="h-2 mb-3" />
            {result.hierarchy_analysis && (
              <p className="text-sm text-muted-foreground">{result.hierarchy_analysis}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Spacing Analysis */}
      {result.spacing_analysis && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutGrid className="h-5 w-5 text-lavender" />
              Spacing & Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm">{result.spacing_analysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Grid Analysis */}
      {result.grid_analysis && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Grid3X3 className="h-5 w-5 text-mint" />
              Grid System
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm">{result.grid_analysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Flow Analysis */}
      {result.flow_analysis && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Move className="h-5 w-5 text-coral" />
              Visual Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm">{result.flow_analysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Responsiveness */}
      {result.responsiveness_notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="h-5 w-5 text-gold" />
              Responsiveness
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm">{result.responsiveness_notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Improvements */}
      {result.improvements && result.improvements.length > 0 && (
        <Card className="bg-gradient-hero border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-5 w-5 text-gold" />
              Suggested Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {result.improvements.map((improvement, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 shrink-0" />
                  {improvement}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
