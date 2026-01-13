import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AIFeedback {
  id: string;
  design_id: string;
  strengths: string[];
  weaknesses: string[];
  ux_score: number;
  suggestion: string;
}

interface AIFeedbackCardProps {
  feedback: AIFeedback;
  designTitle?: string;
}

export const AIFeedbackCard = ({ feedback, designTitle }: AIFeedbackCardProps) => {
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
        <div className={`h-2 bg-gradient-to-r ${getScoreGradient(feedback.ux_score)}`} />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-gold" />
              AI Analysis
              {designTitle && (
                <span className="text-sm font-normal text-muted-foreground">
                  for "{designTitle}"
                </span>
              )}
            </CardTitle>
            <div className={`font-display text-3xl font-bold ${getScoreColor(feedback.ux_score)}`}>
              {feedback.ux_score}
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">UX Score</span>
          </div>
          <Progress 
            value={feedback.ux_score} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle className="h-5 w-5 text-mint" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
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

      {/* Weaknesses */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="h-5 w-5 text-coral" />
            Areas to Improve
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {feedback.weaknesses.map((weakness, index) => (
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

      {/* Suggestion */}
      <Card className="bg-gradient-hero border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-5 w-5 text-gold" />
            Pro Tip
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm leading-relaxed">{feedback.suggestion}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
