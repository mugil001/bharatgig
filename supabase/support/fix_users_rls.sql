-- Allow users to insert their own profile (fixes client-side upsert)
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
