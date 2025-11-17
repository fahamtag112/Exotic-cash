-- Real-Time Investment & Deposit System
-- Database Schema for Complete Real-Time Operations

-- Drop existing tables if needed
DROP TABLE IF EXISTS user_investments CASCADE;
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS daily_returns CASCADE;
DROP TABLE IF EXISTS user_balance CASCADE;

-- Create Investment Plans Table
CREATE TABLE investment_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  min_amount DECIMAL(15, 2) NOT NULL,
  max_amount DECIMAL(15, 2),
  daily_return_percent DECIMAL(5, 2) NOT NULL,
  duration_days INT NOT NULL,
  risk_level VARCHAR(20), -- 'Low', 'Medium', 'High'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User Balance Table
CREATE TABLE user_balance (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  total_deposit DECIMAL(15, 2) DEFAULT 0,
  available_balance DECIMAL(15, 2) DEFAULT 0,
  invested_amount DECIMAL(15, 2) DEFAULT 0,
  total_earnings DECIMAL(15, 2) DEFAULT 0,
  total_withdrawals DECIMAL(15, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Deposit Requests Table
CREATE TABLE deposit_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  admin_id INT,
  admin_notes TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Create User Investments Table
CREATE TABLE user_investments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  daily_return DECIMAL(15, 2),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  total_returned DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES investment_plans(id)
);

-- Create Daily Returns Table
CREATE TABLE daily_returns (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  investment_id INT NOT NULL,
  return_amount DECIMAL(15, 2) NOT NULL,
  return_date DATE DEFAULT CURRENT_DATE,
  is_credited BOOLEAN DEFAULT FALSE,
  credited_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (investment_id) REFERENCES user_investments(id) ON DELETE CASCADE
);

-- Create Notifications Table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50), -- 'deposit_request', 'deposit_approved', 'investment_created', 'daily_return', 'withdrawal'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Withdrawal Requests Table
CREATE TABLE withdrawal_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
  withdrawal_method VARCHAR(50),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  completed_at TIMESTAMP,
  admin_notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Indexes for Performance
CREATE INDEX idx_deposit_requests_user ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_user_investments_user ON user_investments(user_id);
CREATE INDEX idx_user_investments_status ON user_investments(status);
CREATE INDEX idx_daily_returns_user ON daily_returns(user_id);
CREATE INDEX idx_daily_returns_date ON daily_returns(return_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_withdrawal_requests_user ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);

-- Insert Investment Plans
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_return_percent, duration_days, risk_level) VALUES
('Starter Plan', 'بہترین شروعات کے لیے منصوبہ', 50, 500, 0.5, 30, 'Low'),
('Growth Plan', 'درمیانی سطح کی منصوبہ بندی', 500, 5000, 1.0, 60, 'Medium'),
('Premium Plan', 'اعلیٰ منصوبہ بندی', 5000, 50000, 1.5, 90, 'Medium'),
('Elite Plan', 'اشرافیہ کے لیے منصوبہ', 50000, 500000, 2.0, 120, 'High'),
('VIP Plan', 'خصوصی VIP منصوبہ', 500000, NULL, 2.5, 180, 'High'),
('Diamond Plan', 'الماسی منصوبہ - سب سے اعلیٰ', 1000000, NULL, 3.0, 365, 'High');

-- Delete dummy users (keep only Admin and User001)
DELETE FROM users 
WHERE admin_id NOT IN ('Admin112', 'User001');

-- Update existing users active status
UPDATE users SET is_active = TRUE WHERE admin_id IN ('Admin112', 'User001');

-- Create user balances for existing users
INSERT INTO user_balance (user_id, total_deposit, available_balance, invested_amount)
SELECT id, 0, 0, 0 FROM users WHERE admin_id = 'User001'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_balance (user_id, total_deposit, available_balance, invested_amount)
SELECT id, 0, 0, 0 FROM users WHERE admin_id = 'Admin112'
ON CONFLICT (user_id) DO NOTHING;

-- Verify Tables Created
SELECT 'Tables created successfully' AS status;
