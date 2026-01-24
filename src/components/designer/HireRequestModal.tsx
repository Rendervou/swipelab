import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Send, Briefcase } from 'lucide-react';

const hireSchema = z.object({
  project_title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  project_description: z.string().min(20, 'Please provide more details about your project').max(1000),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

type HireForm = z.infer<typeof hireSchema>;

interface HireRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designerId: string;
  designerName: string;
}

export const HireRequestModal = ({
  open,
  onOpenChange,
  designerId,
  designerName,
}: HireRequestModalProps) => {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HireForm>({
    resolver: zodResolver(hireSchema),
  });

  const onSubmit = async (data: HireForm) => {
    if (!user) {
      toast.error('Please login to send a hire request');
      return;
    }

    setSending(true);

    try {
      // Create hire request
      const { data: hireRequest, error: hireError } = await supabase
        .from('hire_requests')
        .insert({
          designer_id: designerId,
          client_id: user.id,
          project_title: data.project_title,
          project_description: data.project_description,
          budget: data.budget || null,
          timeline: data.timeline || null,
        })
        .select()
        .single();

      if (hireError) throw hireError;

      // Send initial message
      const { error: messageError } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: designerId,
        hire_request_id: hireRequest.id,
        content: `Hi ${designerName}! I'd like to discuss a project with you:\n\n**${data.project_title}**\n\n${data.project_description}${data.budget ? `\n\nBudget: ${data.budget}` : ''}${data.timeline ? `\nTimeline: ${data.timeline}` : ''}`,
      });

      if (messageError) throw messageError;

      toast.success('Hire request sent successfully!');
      reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending hire request:', error);
      toast.error('Failed to send hire request');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Hire {designerName}
          </DialogTitle>
          <DialogDescription>
            Send a project proposal to start a conversation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="project_title">Project Title</Label>
            <Input
              {...register('project_title')}
              id="project_title"
              placeholder="e.g., Mobile App Redesign"
            />
            {errors.project_title && (
              <p className="text-sm text-destructive">{errors.project_title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_description">Project Details</Label>
            <Textarea
              {...register('project_description')}
              id="project_description"
              placeholder="Describe your project, goals, and what you're looking for..."
              rows={4}
            />
            {errors.project_description && (
              <p className="text-sm text-destructive">{errors.project_description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Select onValueChange={(value) => setValue('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under $500">Under $500</SelectItem>
                  <SelectItem value="$500 - $1,000">$500 - $1,000</SelectItem>
                  <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                  <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="$10,000+">$10,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline (Optional)</Label>
              <Select onValueChange={(value) => setValue('timeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Less than 1 week">Less than 1 week</SelectItem>
                  <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                  <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                  <SelectItem value="1-3 months">1-3 months</SelectItem>
                  <SelectItem value="3+ months">3+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={sending}>
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
