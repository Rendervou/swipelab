import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Design {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
}

interface FeedbackCriteria {
  id: string;
  label: string;
  question: string;
  value: number;
}

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  design: Design;
  onSubmit: (feedback: { criteria: FeedbackCriteria[]; comment: string }) => void;
}

const getScoreLabel = (value: number) => {
  if (value <= 1) return { label: 'Poor', color: 'bg-destructive' };
  if (value <= 2) return { label: 'Fair', color: 'bg-orange-500' };
  if (value <= 3) return { label: 'Good', color: 'bg-yellow-500' };
  if (value <= 4) return { label: 'Great', color: 'bg-mint' };
  return { label: 'Excellent', color: 'bg-electric-blue' };
};

const initialCriteria: FeedbackCriteria[] = [
  {
    id: 'visual_clarity',
    label: 'Visual Clarity',
    question: 'How clear and readable is the design?',
    value: 3,
  },
  {
    id: 'layout_hierarchy',
    label: 'Layout & Hierarchy',
    question: 'Is the information well organized?',
    value: 3,
  },
  {
    id: 'color_harmony',
    label: 'Color Harmony',
    question: 'Are the colors well balanced and appealing?',
    value: 3,
  },
  {
    id: 'creativity',
    label: 'Creativity',
    question: 'How unique and creative is the design?',
    value: 3,
  },
];

export const FeedbackModal = ({ open, onClose, design, onSubmit }: FeedbackModalProps) => {
  const [criteria, setCriteria] = useState<FeedbackCriteria[]>(initialCriteria);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSliderChange = (id: string, value: number[]) => {
    setCriteria(prev =>
      prev.map(c => (c.id === id ? { ...c, value: value[0] } : c))
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit({ criteria, comment });
    setIsSubmitting(false);
    // Reset form
    setCriteria(initialCriteria);
    setComment('');
  };

  const handleSkipFeedback = () => {
    onClose();
    setCriteria(initialCriteria);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkipFeedback()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <X className="h-5 w-5 text-destructive" />
          </div>
          <DialogTitle className="text-xl">Reject & Give Feedback</DialogTitle>
        </DialogHeader>

        {/* Design Preview */}
        <div className="mt-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
            <img
              src={design.image_url}
              alt={design.title}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold">{design.title}</h3>
        </div>

        {/* Rating Criteria */}
        <div className="mt-6 space-y-6">
          {criteria.map((criterion) => {
            const scoreInfo = getScoreLabel(criterion.value);
            return (
              <motion.div
                key={criterion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-foreground">{criterion.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${scoreInfo.color} text-white`}>
                      {scoreInfo.label}
                    </Badge>
                    <span className="text-lg font-bold text-foreground">{criterion.value}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{criterion.question}</p>
                <div className="relative">
                  <Slider
                    value={[criterion.value]}
                    onValueChange={(value) => handleSliderChange(criterion.id, value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comment Section */}
        <div className="mt-6">
          <label className="text-sm font-medium text-foreground">
            Additional Comments (optional)
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts on how this design could be improved..."
            className="mt-2 min-h-[80px]"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={handleSkipFeedback}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};