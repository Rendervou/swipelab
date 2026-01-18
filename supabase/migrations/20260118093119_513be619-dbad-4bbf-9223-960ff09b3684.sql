-- Allow anyone (including unauthenticated) to view designs
DROP POLICY IF EXISTS "Authenticated users can view designs" ON public.designs;

CREATE POLICY "Anyone can view designs"
ON public.designs FOR SELECT
USING (true);

-- Allow anyone (including unauthenticated) to view profiles (for showing designer info)
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
USING (true);