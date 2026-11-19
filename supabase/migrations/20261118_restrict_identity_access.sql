-- Apply ONLY after the server has SUPABASE_SERVICE_ROLE_KEY and VALVER_SESSION_SECRET.
-- This migration changes permissions, not existing identity data.
BEGIN;
ALTER TABLE public.users_analysis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert for all" ON public.users_analysis;
DROP POLICY IF EXISTS "Allow select for all" ON public.users_analysis;
REVOKE ALL ON TABLE public.users_analysis FROM anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.users_analysis TO service_role;
COMMIT;
