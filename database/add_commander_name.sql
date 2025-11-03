-- Add commander_name field to existing table
ALTER TABLE commander_profiles
ADD COLUMN IF NOT EXISTS commander_name TEXT;

-- Add index on commander_name for faster searches
CREATE INDEX IF NOT EXISTS idx_commander_profiles_name
ON commander_profiles(commander_name);

-- Add unique constraint to prevent duplicate names (optional - remove if you want to allow duplicates)
-- ALTER TABLE commander_profiles
-- ADD CONSTRAINT unique_commander_name UNIQUE (commander_name);