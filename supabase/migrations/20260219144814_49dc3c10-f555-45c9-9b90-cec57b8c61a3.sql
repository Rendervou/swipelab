
-- Rate limiting table for edge functions
CREATE TABLE public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  function_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_rate_limits_user_function_time ON public.rate_limits (user_id, function_name, created_at DESC);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow inserts from authenticated users for their own records
CREATE POLICY "Users can insert their own rate limit records"
ON public.rate_limits FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow select for own records  
CREATE POLICY "Users can view their own rate limits"
ON public.rate_limits FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Auto-cleanup old records (older than 1 day)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE created_at < now() - interval '1 day';
  RETURN NEW;
END;
$$;

CREATE TRIGGER cleanup_rate_limits_trigger
AFTER INSERT ON public.rate_limits
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_old_rate_limits();
