
-- Create design annotations table for pin and box highlights
CREATE TABLE public.design_annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  design_id UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  -- Annotation type: 'pin' for point click, 'box' for rectangle selection
  annotation_type TEXT NOT NULL CHECK (annotation_type IN ('pin', 'box')),
  -- For pin: x_percent, y_percent (percentage of image dimensions)
  -- For box: x_percent, y_percent = top-left corner, width_percent, height_percent = size
  x_percent NUMERIC NOT NULL,
  y_percent NUMERIC NOT NULL,
  width_percent NUMERIC,
  height_percent NUMERIC,
  -- The critique comment
  comment TEXT NOT NULL,
  -- Visibility: 'public' or 'private' (only owner + commenter can see)
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.design_annotations ENABLE ROW LEVEL SECURITY;

-- Public annotations visible to everyone
CREATE POLICY "Anyone can view public annotations"
ON public.design_annotations
FOR SELECT
USING (visibility = 'public');

-- Private annotations visible to commenter
CREATE POLICY "Users can view their own annotations"
ON public.design_annotations
FOR SELECT
USING (auth.uid() = user_id);

-- Private annotations visible to design owner
CREATE POLICY "Design owners can view private annotations"
ON public.design_annotations
FOR SELECT
USING (
  visibility = 'private' AND
  EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = design_annotations.design_id
    AND designs.user_id = auth.uid()
  )
);

-- Authenticated users can create annotations
CREATE POLICY "Authenticated users can create annotations"
ON public.design_annotations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own annotations
CREATE POLICY "Users can delete their own annotations"
ON public.design_annotations
FOR DELETE
USING (auth.uid() = user_id);

-- Users can update their own annotations
CREATE POLICY "Users can update their own annotations"
ON public.design_annotations
FOR UPDATE
USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_design_annotations_design_id ON public.design_annotations(design_id);
CREATE INDEX idx_design_annotations_user_id ON public.design_annotations(user_id);
