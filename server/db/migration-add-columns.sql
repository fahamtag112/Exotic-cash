-- ============================================================================
-- MIGRATION: Add missing columns to existing tables
-- ============================================================================

-- Add missing columns to investment_plans
ALTER TABLE investment_plans ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 365;
ALTER TABLE investment_plans ADD COLUMN IF NOT EXISTS icon VARCHAR(50);

-- Add missing columns to user_balance
ALTER TABLE user_balance ADD COLUMN IF NOT EXISTS available_balance DECIMAL(15,2) DEFAULT 0;
ALTER TABLE user_balance ADD COLUMN IF NOT EXISTS invested_amount DECIMAL(15,2) DEFAULT 0;
ALTER TABLE user_balance ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(15,2) DEFAULT 0;

-- Add missing columns to deposit_requests
ALTER TABLE deposit_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE deposit_requests ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE deposit_requests ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);

-- Verify all tables have required columns
SELECT 'investment_plans columns:' as check_point;
SELECT column_name FROM information_schema.columns WHERE table_name='investment_plans' ORDER BY column_name;

SELECT 'user_balance columns:' as check_point;
SELECT column_name FROM information_schema.columns WHERE table_name='user_balance' ORDER BY column_name;

SELECT 'deposit_requests columns:' as check_point;
SELECT column_name FROM information_schema.columns WHERE table_name='deposit_requests' ORDER BY column_name;

SELECT 'user_investments columns:' as check_point;
SELECT column_name FROM information_schema.columns WHERE table_name='user_investments' ORDER BY column_name;

SELECT 'notifications columns:' as check_point;
SELECT column_name FROM information_schema.columns WHERE table_name='notifications' ORDER BY column_name;

-- ============================================================================
-- Verify investment plans data
-- ============================================================================
SELECT COUNT(*) as total_plans FROM investment_plans WHERE is_active = true;
SELECT id, name, daily_roi, min_amount, max_amount FROM investment_plans ORDER BY daily_roi DESC;

-- ============================================================================
-- Verify user balance exists for all users
-- ============================================================================
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_user_balances FROM user_balance;

-- Show any users without balance
SELECT u.id, u.admin_id, u.full_name FROM users u 
WHERE u.id NOT IN (SELECT user_id FROM user_balance);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
