-- Run this usage in your Supabase Dashboard SQL Editor

-- 1. Add 'category' column (text) if you want to store the slug/name directly
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category TEXT;

-- 2. Add 'is_negotiable' column
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_negotiable BOOLEAN DEFAULT FALSE;

-- 3. Add 'skills' column (array of text)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS skills TEXT[];

-- 4. Make budget_type optional (if not already)
ALTER TABLE jobs ALTER COLUMN budget_type DROP NOT NULL;

-- 5. Make description optional (if not already)
ALTER TABLE jobs ALTER COLUMN description DROP NOT NULL;
