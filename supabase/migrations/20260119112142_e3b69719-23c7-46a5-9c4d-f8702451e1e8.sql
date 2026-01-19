-- Create design_feedback table to store feedback when users skip designs
CREATE TABLE public.design_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  design_id UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  visual_clarity INTEGER NOT NULL CHECK (visual_clarity >= 1 AND visual_clarity <= 5),
  layout_hierarchy INTEGER NOT NULL CHECK (layout_hierarchy >= 1 AND layout_hierarchy <= 5),
  color_harmony INTEGER NOT NULL CHECK (color_harmony >= 1 AND color_harmony <= 5),
  creativity INTEGER NOT NULL CHECK (creativity >= 1 AND creativity <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.design_feedback ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert feedback
CREATE POLICY "Users can submit feedback"
ON public.design_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own feedback
CREATE POLICY "Users can view their own feedback"
ON public.design_feedback
FOR SELECT
USING (auth.uid() = user_id);

-- Allow design owners to view feedback on their designs
CREATE POLICY "Design owners can view feedback"
ON public.design_feedback
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = design_feedback.design_id
    AND designs.user_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_design_feedback_design_id ON public.design_feedback(design_id);
CREATE INDEX idx_design_feedback_user_id ON public.design_feedback(user_id);