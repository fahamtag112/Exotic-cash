-- ============================================================================
-- EXOTIC CASH - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This file creates all necessary tables for the investment/deposit system
-- Run this after init.sql to ensure all tables exist with correct structure
-- ============================================================================

-- ============================================================================
-- INVESTMENT PLANS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS investment_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  min_amount DECIMAL(15,2) NOT NULL,
  max_amount DECIMAL(15,2) NOT NULL,
  daily_roi DECIMAL(5,2) NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 365,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name)
);

CREATE INDEX IF NOT EXISTS idx_investment_plans_active ON investment_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_investment_plans_roi ON investment_plans(daily_roi);

-- ============================================================================
-- USER BALANCE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_balance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  total_deposit DECIMAL(15,2) DEFAULT 0,
  available_balance DECIMAL(15,2) DEFAULT 0,
  invested_amount DECIMAL(15,2) DEFAULT 0,
  total_earnings DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_balance_user_id ON user_balance(user_id);
CREATE INDEX IF NOT EXISTS idx_user_balance_updated_at ON user_balance(updated_at);

-- ============================================================================
-- DEPOSIT REQUESTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS deposit_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  admin_id INTEGER,
  admin_notes TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_created_at ON deposit_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_admin_id ON deposit_requests(admin_id);

-- ============================================================================
-- USER INVESTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_investments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  plan_id INTEGER NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  daily_return DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- active, completed, withdrawn
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES investment_plans(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_plan_id ON user_investments(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_status ON user_investments(status);
CREATE INDEX IF NOT EXISTS idx_user_investments_created_at ON user_investments(created_at);

-- ============================================================================
-- DAILY RETURNS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_returns (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  investment_id INTEGER NOT NULL,
  return_amount DECIMAL(15,2) NOT NULL,
  return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (investment_id) REFERENCES user_investments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_daily_returns_user_id ON daily_returns(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_returns_investment_id ON daily_returns(investment_id);
CREATE INDEX IF NOT EXISTS idx_daily_returns_return_date ON daily_returns(return_date);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type VARCHAR(100) NOT NULL, -- deposit_request, deposit_approved, deposit_rejected, earnings, withdrawal, investment_completed
  title VARCHAR(255),
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- ============================================================================
-- EMAIL VERIFICATION TABLES
-- ============================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  token VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires_at ON email_verification_tokens(expires_at);

-- ============================================================================
-- PASSWORD RESET TOKENS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id);

-- ============================================================================
-- VERIFICATION LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS verification_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  status VARCHAR(50) NOT NULL,
  error_message VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_verification_logs_user_id ON verification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_created_at ON verification_logs(created_at);

-- ============================================================================
-- INSERT SAMPLE INVESTMENT PLANS (if not already present)
-- ============================================================================
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_roi, duration_days, icon, is_active) VALUES
('Starter Plan', 'Perfect for beginners. Minimum $100 investment with 2.5% daily ROI', 100, 999, 2.50, 365, 'TrendingUp', TRUE),
('Silver Plan', 'Popular choice. $1000-$4999 investment with 3.5% daily ROI', 1000, 4999, 3.50, 365, 'Award', TRUE),
('Gold Plan', 'Premium plan. $5000-$9999 investment with 4.5% daily ROI', 5000, 9999, 4.50, 365, 'Zap', TRUE),
('Platinum Plan', 'Elite plan. $10000-$49999 investment with 5.5% daily ROI', 10000, 49999, 5.50, 365, 'Crown', TRUE),
('Diamond Plan', 'VIP plan. $50000-$100000 investment with 6.5% daily ROI', 50000, 100000, 6.50, 365, 'Gem', TRUE),
('Ultimate Plan', 'Maximum returns. $100001+ investment with 7.5% daily ROI', 100001, 1000000, 7.50, 365, 'Zap2', TRUE)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ENSURE USER BALANCES EXIST FOR ALL USERS
-- ============================================================================
INSERT INTO user_balance (user_id, total_deposit, available_balance, invested_amount, total_earnings)
SELECT id, 0, 0, 0, 0 FROM users WHERE id NOT IN (SELECT user_id FROM user_balance)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================================
-- All tables have been created with proper relationships and indexes
-- Ready for production use
