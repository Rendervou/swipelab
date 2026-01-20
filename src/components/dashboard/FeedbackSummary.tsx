import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, Eye, Layers, Palette, Lightbulb } from 'lucide-react';

interface DesignFeedback {
  design_id: string;
  design_title: string;
  design_image: string;
  total_reviews: number;
  avg_visual_clarity: number;
  avg_layout_hierarchy: number;
  avg_color_harmony: number;
  avg_creativity: number;
  comments: Array<{ comment: string; created_at: string }>;
}

interface FeedbackSummaryProps {
  feedbackData: DesignFeedback[];
}

const RatingBar = ({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType;
}) => {
  const percentage = (value / 5) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </div>
        <span className="font-medium">{value.toFixed(1)}/5</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export const FeedbackSummary = ({ feedbackData }: FeedbackSummaryProps) => {
  if (feedbackData.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl border-2 border-dashed">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold mb-2">No feedback yet</h3>
        <p className="text-muted-foreground">
          When users review your designs, their feedback will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedbackData.map((design, index) => (
        <motion.div
          key={design.design_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <img 
                  src={design.design_image} 
                  alt={design.design_title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{design.design_title}</CardTitle>
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    {design.total_reviews} {design.total_reviews === 1 ? 'review' : 'reviews'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ratings Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <RatingBar 
                  label="Visual Clarity" 
                  value={design.avg_visual_clarity} 
                  icon={Eye} 
                />
                <RatingBar 
                  label="Layout & Hierarchy" 
                  value={design.avg_layout_hierarchy} 
                  icon={Layers} 
                />
                <RatingBar 
                  label="Color Harmony" 
                  value={design.avg_color_harmony} 
                  icon={Palette} 
                />
                <RatingBar 
                  label="Creativity" 
                  value={design.avg_creativity} 
                  icon={Lightbulb} 
                />
              </div>

              {/* Overall Score */}
              <div className="flex items-center justify-center gap-2 py-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Overall Score:</span>
                <span className="text-2xl font-bold text-primary">
                  {((design.avg_visual_clarity + design.avg_layout_hierarchy + 
                     design.avg_color_harmony + design.avg_creativity) / 4).toFixed(1)}
                </span>
                <span className="text-muted-foreground">/ 5</span>
              </div>

              {/* Comments Section */}
              {design.comments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments ({design.comments.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {design.comments.map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-muted/30 rounded-lg text-sm"
                      >
                        <p className="text-foreground">{item.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
