-- Add email verification fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP;

-- Create index on verification_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);

-- Update existing users to be verified (they were created before this feature)
UPDATE users SET is_verified = TRUE WHERE is_verified IS NULL AND created_at < NOW();
