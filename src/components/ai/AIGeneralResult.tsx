import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';

interface GeneralResult {
  ux_score?: number;
  strengths?: string[];
  weaknesses?: string[];
  suggestion?: string;
  raw_response?: string;
}

interface AIGeneralResultProps {
  result: GeneralResult;
}

export const AIGeneralResult = ({ result }: AIGeneralResultProps) => {
  if (result.raw_response) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap">{result.raw_response}</p>
        </CardContent>
      </Card>
    );
  }

  const score = result.ux_score || 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-mint';
    if (score >= 60) return 'text-gold';
    return 'text-coral';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-mint to-electric-blue';
    if (score >= 60) return 'from-gold to-coral-light';
    return 'from-coral to-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Score Card */}
      <Card className="overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${getScoreGradient(score)}`} />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              UX Score
            </CardTitle>
            <div className={`font-display text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={score} className="h-2" />
        </CardContent>
      </Card>

      {/* Strengths */}
      {result.strengths && result.strengths.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-5 w-5 text-mint" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {result.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-mint mt-2 shrink-0" />
                  {strength}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Weaknesses */}
      {result.weaknesses && result.weaknesses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-5 w-5 text-coral" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {result.weaknesses.map((weakness, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-coral mt-2 shrink-0" />
                  {weakness}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestion */}
      {result.suggestion && (
        <Card className="bg-gradient-hero border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-5 w-5 text-gold" />
              Pro Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm">{result.suggestion}</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
