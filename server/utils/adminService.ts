import { Pool } from 'pg';
import { generateVerificationToken, getTokenExpiration } from './emailService.js';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
});

/**
 * Get all users with their balance information
 */
export async function getAllUsers() {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.admin_id,
        u.full_name,
        u.role,
        u.created_at,
        COALESCE(b.total_deposit, 0) as total_deposit,
        COALESCE(b.total_withdrawal, 0) as total_withdrawal,
        COALESCE(b.current_balance, 0) as current_balance,
        b.last_updated
      FROM users u
      LEFT JOIN user_balance b ON u.id = b.user_id
      ORDER BY u.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Get user balance and transaction summary
 */
export async function getUserBalance(userId: number) {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.admin_id,
        u.full_name,
        u.role,
        COALESCE(b.total_deposit, 0) as total_deposit,
        COALESCE(b.total_withdrawal, 0) as total_withdrawal,
        COALESCE(b.current_balance, 0) as current_balance,
        b.last_updated,
        (SELECT COUNT(*) FROM deposit_requests WHERE user_id = $1 AND status = 'pending') as pending_deposits,
        (SELECT COUNT(*) FROM withdrawal_requests WHERE user_id = $1 AND status = 'pending') as pending_withdrawals
      FROM users u
      LEFT JOIN user_balance b ON u.id = b.user_id
      WHERE u.id = $1
    `, [userId]);
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user balance:', error);
    throw error;
  }
}

/**
 * Create a deposit request
 */
export async function createDepositRequest(userId: number, amount: number, currency: string = 'USD') {
  try {
    const result = await pool.query(`
      INSERT INTO deposit_requests (user_id, amount, currency, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `, [userId, amount, currency]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating deposit request:', error);
    throw error;
  }
}

/**
 * Create a withdrawal request
 */
export async function createWithdrawalRequest(userId: number, amount: number, currency: string = 'USD') {
  try {
    const result = await pool.query(`
      INSERT INTO withdrawal_requests (user_id, amount, currency, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `, [userId, amount, currency]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    throw error;
  }
}

/**
 * Get all pending deposit requests
 */
export async function getPendingDepositRequests() {
  try {
    const result = await pool.query(`
      SELECT 
        dr.id,
        dr.user_id,
        dr.amount,
        dr.currency,
        dr.status,
        dr.request_date,
        u.email,
        u.admin_id,
        u.full_name
      FROM deposit_requests dr
      JOIN users u ON dr.user_id = u.id
      WHERE dr.status = 'pending'
      ORDER BY dr.request_date ASC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching pending deposits:', error);
    throw error;
  }
}

/**
 * Get all pending withdrawal requests
 */
export async function getPendingWithdrawalRequests() {
  try {
    const result = await pool.query(`
      SELECT 
        wr.id,
        wr.user_id,
        wr.amount,
        wr.currency,
        wr.status,
        wr.request_date,
        u.email,
        u.admin_id,
        u.full_name
      FROM withdrawal_requests wr
      JOIN users u ON wr.user_id = u.id
      WHERE wr.status = 'pending'
      ORDER BY wr.request_date ASC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching pending withdrawals:', error);
    throw error;
  }
}

/**
 * Approve a deposit request
 */
export async function approveDepositRequest(
  requestId: number,
  adminId: number,
  notes: string = ''
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the deposit request
    const reqResult = await client.query(
      'SELECT * FROM deposit_requests WHERE id = $1',
      [requestId]
    );
    
    if (reqResult.rows.length === 0) {
      throw new Error('Deposit request not found');
    }

    const request = reqResult.rows[0];
    const { user_id, amount } = request;

    // Update deposit request status
    await client.query(`
      UPDATE deposit_requests
      SET status = 'approved', approved_date = CURRENT_TIMESTAMP, approved_by = $1, notes = $2
      WHERE id = $3
    `, [adminId, notes, requestId]);

    // Update user balance
    await client.query(`
      INSERT INTO user_balance (user_id, total_deposit, current_balance)
      VALUES ($1, $2, $2)
      ON CONFLICT (user_id) DO UPDATE
      SET 
        total_deposit = user_balance.total_deposit + $2,
        current_balance = user_balance.current_balance + $2,
        last_updated = CURRENT_TIMESTAMP
    `, [user_id, amount]);

    // Add transaction history
    await client.query(`
      INSERT INTO transaction_history (user_id, type, amount, status, description, request_id, performed_by)
      VALUES ($1, 'deposit', $2, 'completed', 'Approved deposit request', $3, $4)
    `, [user_id, amount, requestId, adminId]);

    // Log admin activity
    await client.query(`
      INSERT INTO admin_activity_log (admin_id, action, target_user_id, details)
      VALUES ($1, 'approve_deposit', $2, $3)
    `, [adminId, user_id, JSON.stringify({ request_id: requestId, amount, notes })]);

    await client.query('COMMIT');
    return request;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving deposit:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Reject a deposit request
 */
export async function rejectDepositRequest(
  requestId: number,
  adminId: number,
  rejectionReason: string
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the deposit request
    const reqResult = await client.query(
      'SELECT * FROM deposit_requests WHERE id = $1',
      [requestId]
    );
    
    if (reqResult.rows.length === 0) {
      throw new Error('Deposit request not found');
    }

    const request = reqResult.rows[0];

    // Update deposit request status
    await client.query(`
      UPDATE deposit_requests
      SET status = 'rejected', approved_by = $1, rejection_reason = $2, approved_date = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [adminId, rejectionReason, requestId]);

    // Log admin activity
    await client.query(`
      INSERT INTO admin_activity_log (admin_id, action, target_user_id, details)
      VALUES ($1, 'reject_deposit', $2, $3)
    `, [adminId, request.user_id, JSON.stringify({ request_id: requestId, reason: rejectionReason })]);

    await client.query('COMMIT');
    return request;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error rejecting deposit:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Approve a withdrawal request
 */
export async function approveWithdrawalRequest(
  requestId: number,
  adminId: number,
  notes: string = ''
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the withdrawal request
    const reqResult = await client.query(
      'SELECT * FROM withdrawal_requests WHERE id = $1',
      [requestId]
    );
    
    if (reqResult.rows.length === 0) {
      throw new Error('Withdrawal request not found');
    }

    const request = reqResult.rows[0];
    const { user_id, amount } = request;

    // Check if user has sufficient balance
    const balanceResult = await client.query(
      'SELECT current_balance FROM user_balance WHERE user_id = $1',
      [user_id]
    );

    if (balanceResult.rows.length === 0 || balanceResult.rows[0].current_balance < amount) {
      throw new Error('Insufficient balance for withdrawal');
    }

    // Update withdrawal request status
    await client.query(`
      UPDATE withdrawal_requests
      SET status = 'approved', approved_date = CURRENT_TIMESTAMP, approved_by = $1, notes = $2
      WHERE id = $3
    `, [adminId, notes, requestId]);

    // Update user balance
    await client.query(`
      UPDATE user_balance
      SET 
        total_withdrawal = total_withdrawal + $1,
        current_balance = current_balance - $1,
        last_updated = CURRENT_TIMESTAMP
      WHERE user_id = $2
    `, [amount, user_id]);

    // Add transaction history
    await client.query(`
      INSERT INTO transaction_history (user_id, type, amount, status, description, request_id, performed_by)
      VALUES ($1, 'withdrawal', $2, 'completed', 'Approved withdrawal request', $3, $4)
    `, [user_id, amount, requestId, adminId]);

    // Log admin activity
    await client.query(`
      INSERT INTO admin_activity_log (admin_id, action, target_user_id, details)
      VALUES ($1, 'approve_withdrawal', $2, $3)
    `, [adminId, user_id, JSON.stringify({ request_id: requestId, amount, notes })]);

    await client.query('COMMIT');
    return request;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving withdrawal:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Reject a withdrawal request
 */
export async function rejectWithdrawalRequest(
  requestId: number,
  adminId: number,
  rejectionReason: string
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the withdrawal request
    const reqResult = await client.query(
      'SELECT * FROM withdrawal_requests WHERE id = $1',
      [requestId]
    );
    
    if (reqResult.rows.length === 0) {
      throw new Error('Withdrawal request not found');
    }

    const request = reqResult.rows[0];

    // Update withdrawal request status
    await client.query(`
      UPDATE withdrawal_requests
      SET status = 'rejected', approved_by = $1, rejection_reason = $2, approved_date = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [adminId, rejectionReason, requestId]);

    // Log admin activity
    await client.query(`
      INSERT INTO admin_activity_log (admin_id, action, target_user_id, details)
      VALUES ($1, 'reject_withdrawal', $2, $3)
    `, [adminId, request.user_id, JSON.stringify({ request_id: requestId, reason: rejectionReason })]);

    await client.query('COMMIT');
    return request;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error rejecting withdrawal:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Remove a user (soft delete by marking)
 */
export async function removeUser(userId: number, adminId: number, reason: string) {
  try {
    await pool.query(`
      UPDATE users
      SET is_active = false
      WHERE id = $1
    `, [userId]);

    // Log admin activity
    await pool.query(`
      INSERT INTO admin_activity_log (admin_id, action, target_user_id, details)
      VALUES ($1, 'remove_user', $2, $3)
    `, [adminId, userId, JSON.stringify({ reason })]);

    return { success: true, message: 'User removed' };
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
}

/**
 * Restore a removed user
 */
export async function restoreUser(userId: number, adminId: number) {
  try {
    await pool.query(`
      UPDATE users
      SET is_active = true
      WHERE id = $1
    `, [userId]);

    // Log admin activity
    await pool.query(`
      INSERT INTO admin_activity_log (admin_id, action, target_user_id, details)
      VALUES ($1, 'restore_user', $2, $3)
    `, [adminId, userId, JSON.stringify({ action: 'restore' })]);

    return { success: true, message: 'User restored' };
  } catch (error) {
    console.error('Error restoring user:', error);
    throw error;
  }
}

/**
 * Get admin activity log
 */
export async function getAdminActivityLog(limit: number = 100, offset: number = 0) {
  try {
    const result = await pool.query(`
      SELECT 
        aal.id,
        aal.admin_id,
        aal.action,
        aal.target_user_id,
        aal.details,
        aal.created_at,
        admin.email as admin_email,
        target_user.email as target_user_email
      FROM admin_activity_log aal
      LEFT JOIN users admin ON aal.admin_id = admin.id
      LEFT JOIN users target_user ON aal.target_user_id = target_user.id
      ORDER BY aal.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return result.rows;
  } catch (error) {
    console.error('Error fetching admin activity log:', error);
    throw error;
  }
}

/**
 * Get transaction history for a user
 */
export async function getUserTransactionHistory(userId: number) {
  try {
    const result = await pool.query(`
      SELECT *
      FROM transaction_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]);

    return result.rows;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
}

/**
 * Get summary statistics for admin dashboard
 */
export async function getAdminDashboardStats() {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE is_active = true) as total_users,
        (SELECT COUNT(*) FROM deposit_requests WHERE status = 'pending') as pending_deposits,
        (SELECT COUNT(*) FROM withdrawal_requests WHERE status = 'pending') as pending_withdrawals,
        (SELECT SUM(amount) FROM deposit_requests WHERE status = 'approved') as total_approved_deposits,
        (SELECT SUM(amount) FROM withdrawal_requests WHERE status = 'approved') as total_approved_withdrawals,
        (SELECT SUM(current_balance) FROM user_balance) as total_user_balance,
        (SELECT COUNT(*) FROM deposit_requests WHERE DATE(request_date) = CURRENT_DATE) as todays_deposits,
        (SELECT COUNT(*) FROM withdrawal_requests WHERE DATE(request_date) = CURRENT_DATE) as todays_withdrawals
    `);

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}
