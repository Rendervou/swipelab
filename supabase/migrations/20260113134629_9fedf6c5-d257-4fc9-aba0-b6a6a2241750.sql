-- Create enum for design categories
CREATE TYPE public.design_category AS ENUM ('ui_ux', 'poster', 'illustration');

-- Create enum for swipe types
CREATE TYPE public.swipe_type AS ENUM ('like', 'skip');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create designs table
CREATE TABLE public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category design_category NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create swipes table with unique constraint
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE NOT NULL,
  type swipe_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, design_id)
);

-- Create AI feedback table
CREATE TABLE public.ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  ux_score INTEGER CHECK (ux_score >= 0 AND ux_score <= 100),
  suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- User roles policies (only admins can manage, users can view their own)
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Designs policies
CREATE POLICY "Anyone can view designs"
ON public.designs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own designs"
ON public.designs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
ON public.designs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs"
ON public.designs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all designs"
ON public.designs FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Swipes policies
CREATE POLICY "Users can view their own swipes"
ON public.swipes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own swipes"
ON public.swipes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- AI Feedback policies
CREATE POLICY "Design owners can view their AI feedback"
ON public.ai_feedback FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.designs
    WHERE designs.id = ai_feedback.design_id
    AND designs.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view AI feedback for any design"
ON public.ai_feedback FOR SELECT
TO authenticated
USING (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for design images
INSERT INTO storage.buckets (id, name, public) VALUES ('designs', 'designs', true);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for designs bucket
CREATE POLICY "Anyone can view design images"
ON storage.objects FOR SELECT
USING (bucket_id = 'designs');

CREATE POLICY "Authenticated users can upload design images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'designs');

CREATE POLICY "Users can update their own design images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'designs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own design images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'designs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload their avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);