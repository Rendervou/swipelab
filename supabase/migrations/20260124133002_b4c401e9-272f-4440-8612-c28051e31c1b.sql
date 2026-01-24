-- Add availability status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS available_for_hire boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hourly_rate text,
ADD COLUMN IF NOT EXISTS location text;

-- Create hire_requests table
CREATE TABLE public.hire_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_title text NOT NULL,
  project_description text NOT NULL,
  budget text,
  timeline text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hire_request_id uuid REFERENCES public.hire_requests(id) ON DELETE SET NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create follows table
CREATE TABLE public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  design_id uuid NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, design_id)
);

-- Enable RLS on all tables
ALTER TABLE public.hire_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS policies for hire_requests
CREATE POLICY "Users can view hire requests they're involved in"
  ON public.hire_requests FOR SELECT
  USING (auth.uid() = designer_id OR auth.uid() = client_id);

CREATE POLICY "Users can create hire requests"
  ON public.hire_requests FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Designers can update their hire requests"
  ON public.hire_requests FOR UPDATE
  USING (auth.uid() = designer_id OR auth.uid() = client_id);

-- RLS policies for messages
CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update message read status"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- RLS policies for follows
CREATE POLICY "Anyone can view follows"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- RLS policies for bookmarks
CREATE POLICY "Users can view their bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_hire_requests_designer ON public.hire_requests(designer_id);
CREATE INDEX idx_hire_requests_client ON public.hire_requests(client_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_design ON public.bookmarks(design_id);

-- Update trigger for hire_requests
CREATE TRIGGER update_hire_requests_updated_at
  BEFORE UPDATE ON public.hire_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;