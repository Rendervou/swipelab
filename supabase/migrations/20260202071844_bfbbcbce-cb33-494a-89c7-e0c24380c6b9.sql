-- Create service category enum
CREATE TYPE public.service_category AS ENUM (
  'ui_ux_design',
  'graphic_design',
  'illustration',
  'branding',
  'web_design',
  'mobile_design',
  'motion_graphics',
  'other'
);

-- Create designer_services table
CREATE TABLE public.designer_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  designer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  
  -- Pricing tiers (basic, standard, premium)
  basic_price DECIMAL(10,2),
  basic_description TEXT,
  basic_delivery_days INTEGER,
  basic_revisions INTEGER DEFAULT 1,
  
  standard_price DECIMAL(10,2),
  standard_description TEXT,
  standard_delivery_days INTEGER,
  standard_revisions INTEGER DEFAULT 2,
  
  premium_price DECIMAL(10,2),
  premium_description TEXT,
  premium_delivery_days INTEGER,
  premium_revisions INTEGER DEFAULT 5,
  
  -- Portfolio images (array of URLs)
  portfolio_images TEXT[] DEFAULT '{}',
  
  -- FAQ (stored as JSONB array of {question, answer} objects)
  faq JSONB DEFAULT '[]',
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_testimonials table
CREATE TABLE public.service_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.designer_services(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.designer_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for designer_services
CREATE POLICY "Anyone can view active services"
ON public.designer_services
FOR SELECT
USING (is_active = true);

CREATE POLICY "Designers can view their own services"
ON public.designer_services
FOR SELECT
USING (auth.uid() = designer_id);

CREATE POLICY "Designers can create their own services"
ON public.designer_services
FOR INSERT
WITH CHECK (auth.uid() = designer_id);

CREATE POLICY "Designers can update their own services"
ON public.designer_services
FOR UPDATE
USING (auth.uid() = designer_id);

CREATE POLICY "Designers can delete their own services"
ON public.designer_services
FOR DELETE
USING (auth.uid() = designer_id);

-- RLS Policies for service_testimonials
CREATE POLICY "Anyone can view testimonials"
ON public.service_testimonials
FOR SELECT
USING (true);

CREATE POLICY "Clients can create testimonials"
ON public.service_testimonials
FOR INSERT
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own testimonials"
ON public.service_testimonials
FOR UPDATE
USING (auth.uid() = client_id);

CREATE POLICY "Clients can delete their own testimonials"
ON public.service_testimonials
FOR DELETE
USING (auth.uid() = client_id);

-- Create trigger for updated_at
CREATE TRIGGER update_designer_services_updated_at
BEFORE UPDATE ON public.designer_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_designer_services_category ON public.designer_services(category);
CREATE INDEX idx_designer_services_designer ON public.designer_services(designer_id);
CREATE INDEX idx_designer_services_active ON public.designer_services(is_active) WHERE is_active = true;