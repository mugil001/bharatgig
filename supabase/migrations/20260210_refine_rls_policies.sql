-- ============================================
-- Refine RLS Policies
-- ============================================

-- 1. Jobs Policies
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view open jobs" ON jobs;

-- Create stricter policies
-- Public can ONLY view jobs that are explicitly 'open'
CREATE POLICY "Public can view open jobs" ON jobs FOR SELECT USING (status = 'open');

-- Clients can view ALL their own jobs (including drafts, closed, etc.)
CREATE POLICY "Clients can view own jobs" ON jobs FOR SELECT USING (auth.uid() = client_id);

-- 2. Profiles (Ensure public access is maintained but clarifying)
-- Existing: "Users can view all profiles" works for logged in users.
-- We might want public (unauthenticated) access too for landing pages?
-- The current policy 'USING (true)' allows both auth and anon if anon role has access, 
-- but usually 'Users' implies authenticated.
-- Let's ensure public access for profiles.

DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Anyone can view freelancer profiles" ON freelancer_profiles;
DROP POLICY IF EXISTS "Anyone can view client profiles" ON client_profiles;

CREATE POLICY "Public can view profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Public can view freelancer profiles" ON freelancer_profiles FOR SELECT USING (true);
CREATE POLICY "Public can view client profiles" ON client_profiles FOR SELECT USING (true);
