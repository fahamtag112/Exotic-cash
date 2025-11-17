-- Admin Request Management Tables

-- Create ENUM for request status
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE request_type AS ENUM ('deposit', 'withdrawal');

-- Create deposit_requests table
CREATE TABLE IF NOT EXISTS deposit_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(10) DEFAULT 'USD',
  status request_status DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_date TIMESTAMP,
  approved_by INTEGER, -- admin user_id who approved
  rejection_reason VARCHAR(500),
  notes VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(10) DEFAULT 'USD',
  status request_status DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_date TIMESTAMP,
  approved_by INTEGER, -- admin user_id who approved
  rejection_reason VARCHAR(500),
  notes VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create user_balance table to track user deposits and withdrawals
CREATE TABLE IF NOT EXISTS user_balance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  total_deposit DECIMAL(15, 2) DEFAULT 0,
  total_withdrawal DECIMAL(15, 2) DEFAULT 0,
  current_balance DECIMAL(15, 2) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create transaction_history table for audit trail
CREATE TABLE IF NOT EXISTS transaction_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal', 'admin_adjustment'
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  description VARCHAR(500),
  request_id INTEGER,
  performed_by INTEGER, -- admin who made the transaction
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create admin_activity_log for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  action VARCHAR(100) NOT NULL, -- 'approve_deposit', 'reject_deposit', 'add_user', 'remove_user', etc.
  target_user_id INTEGER,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_request_date ON deposit_requests(request_date);

CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_request_date ON withdrawal_requests(request_date);

CREATE INDEX IF NOT EXISTS idx_user_balance_user_id ON user_balance(user_id);

CREATE INDEX IF NOT EXISTS idx_transaction_history_user_id ON transaction_history(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_history_created_at ON transaction_history(created_at);

CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);

-- Grant permissions
GRANT ALL PRIVILEGES ON deposit_requests TO postgres;
GRANT ALL PRIVILEGES ON withdrawal_requests TO postgres;
GRANT ALL PRIVILEGES ON user_balance TO postgres;
GRANT ALL PRIVILEGES ON transaction_history TO postgres;
GRANT ALL PRIVILEGES ON admin_activity_log TO postgres;
