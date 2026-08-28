-- Create table to store push notification tokens
CREATE TABLE IF NOT EXISTS user_push_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Can be 'você' or 'namorada' for now, or auth.uid() when using Supabase Auth
  push_token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL, -- 'web', 'ios', 'android'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_push_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own tokens
CREATE POLICY "Users can insert their own push tokens"
  ON user_push_tokens
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can view all tokens (needed for notification system)
CREATE POLICY "Users can view push tokens"
  ON user_push_tokens
  FOR SELECT
  USING (true);

-- Policy: Users can update their own tokens
CREATE POLICY "Users can update their own push tokens"
  ON user_push_tokens
  FOR UPDATE
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_user_push_tokens_user_id ON user_push_tokens(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_push_tokens_updated_at
  BEFORE UPDATE ON user_push_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
