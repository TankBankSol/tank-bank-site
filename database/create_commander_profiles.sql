-- Create commander_profiles table
CREATE TABLE IF NOT EXISTS commander_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  rank TEXT DEFAULT 'Recruit' NOT NULL,
  missions_completed INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_commander_profiles_wallet
ON commander_profiles(wallet_address);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_commander_profiles_updated_at ON commander_profiles;
CREATE TRIGGER update_commander_profiles_updated_at
  BEFORE UPDATE ON commander_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE commander_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (users can only read/write their own profiles)
CREATE POLICY "Users can view their own profile" ON commander_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON commander_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON commander_profiles
  FOR UPDATE USING (true);