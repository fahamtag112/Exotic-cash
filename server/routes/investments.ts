import express, { Request, Response } from 'express';
import pool from '../db/connection.js';
import { verifyToken, verifyAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all investment plans
router.get('/plans', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM investment_plans WHERE is_active = true ORDER BY daily_roi DESC'
    );
    res.json({
      success: true,
      plans: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch plans' });
  }
});

// Get user balance
router.get('/user-balance', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT * FROM user_balance WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      // Create balance if doesn't exist
      await pool.query(
        `INSERT INTO user_balance (user_id, total_deposit, available_balance, invested_amount, total_earnings)
         VALUES ($1, 0, 0, 0, 0)`,
        [userId]
      );
      return res.json({
        success: true,
        balance: {
          user_id: userId,
          total_deposit: 0,
          available_balance: 0,
          invested_amount: 0,
          total_earnings: 0
        }
      });
    }

    res.json({ success: true, balance: result.rows[0] });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch balance' });
  }
});

// Create deposit request
router.post('/deposit-request', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    const result = await pool.query(
      `INSERT INTO deposit_requests (user_id, amount, payment_method, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [userId, amount, paymentMethod || 'Bank Transfer']
    );

    // Create notification for admin
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       SELECT $1, 'deposit_request', 'نیا Deposit درخواست', 
              'صارف نے $' || $2 || ' کی deposit درخواست کی ہے',
              jsonb_build_object('deposit_id', $3, 'user_id', $4, 'amount', $2)
       FROM users WHERE role = 'admin'`,
      [1, amount, result.rows[0].id, userId]
    );

    res.json({ 
      success: true, 
      message: 'Deposit request submitted successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating deposit request:', error);
    res.status(500).json({ success: false, error: 'Failed to create deposit request' });
  }
});

// Get user deposit requests
router.get('/my-deposits', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT dr.*, u.full_name as admin_name 
       FROM deposit_requests dr
       LEFT JOIN users u ON dr.approved_by = u.id
       WHERE dr.user_id = $1
       ORDER BY dr.request_date DESC`,
      [userId]
    );

    res.json({ success: true, deposits: result.rows });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch deposits' });
  }
});

// Get pending deposit requests (Admin only)
router.get('/pending-requests', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    // Check if admin
    const adminCheck = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (adminCheck.rows[0]?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const result = await pool.query(
      `SELECT dr.*, u.full_name, u.email, u.admin_id
       FROM deposit_requests dr
       JOIN users u ON dr.user_id = u.id
       WHERE dr.status = 'pending'
       ORDER BY dr.request_date ASC`
    );

    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch requests' });
  }
});

// Approve deposit request (Admin only)
router.post('/approve-deposit', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id;
    
    if (!adminId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    const { depositId } = req.body;

    // Check if admin
    const adminCheck = await pool.query('SELECT role FROM users WHERE id = $1', [adminId]);
    if (adminCheck.rows[0]?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    // Get deposit request
    const depositResult = await pool.query(
      'SELECT * FROM deposit_requests WHERE id = $1',
      [depositId]
    );

    if (depositResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Deposit request not found' });
    }

    const deposit = depositResult.rows[0];
    const userId = deposit.user_id;

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update deposit request status
      await client.query(
        `UPDATE deposit_requests SET status = 'approved', admin_id = $1, approved_at = NOW()
         WHERE id = $2`,
        [adminId, depositId]
      );

      // Update user balance
      await client.query(
        `UPDATE user_balance 
         SET total_deposit = total_deposit + $1,
             available_balance = available_balance + $1,
             updated_at = NOW()
         WHERE user_id = $2`,
        [deposit.amount, userId]
      );

      // Create notification for user
      await client.query(
        `INSERT INTO notifications (user_id, type, title, message, data)
         VALUES ($1, 'deposit_approved', 'Deposit منظور ہو گیا ✅', 
                'آپ کی $' || $2 || ' کی deposit منظور ہو چکی ہے',
                jsonb_build_object('amount', $2, 'deposit_id', $3))`,
        [userId, deposit.amount, depositId]
      );

      await client.query('COMMIT');

      res.json({ 
        success: true,
        message: 'Deposit approved successfully',
        newBalance: deposit.amount
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error approving deposit:', error);
    res.status(500).json({ success: false, error: 'Failed to approve deposit' });
  }
});

// Create investment
router.post('/invest', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    const { planId, amount } = req.body;

    // Get plan details
    const planResult = await pool.query(
      'SELECT * FROM investment_plans WHERE id = $1',
      [planId]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }

    const plan = planResult.rows[0];

    // Check user balance
    const balanceResult = await pool.query(
      'SELECT available_balance FROM user_balance WHERE user_id = $1',
      [userId]
    );

    if (balanceResult.rows[0]?.available_balance < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create investment
      const investResult = await client.query(
        `INSERT INTO user_investments (user_id, plan_id, amount, daily_return, status, end_date)
         VALUES ($1, $2, $3, $4, 'active', NOW() + INTERVAL '1 day' * $5)
         RETURNING *`,
        [userId, planId, amount, (amount * plan.daily_roi / 100).toFixed(2), plan.duration_days]
      );

      // Update balance
      await client.query(
        `UPDATE user_balance 
         SET available_balance = available_balance - $1,
             invested_amount = invested_amount + $1,
             updated_at = NOW()
         WHERE user_id = $2`,
        [amount, userId]
      );

      await client.query('COMMIT');

      res.json({ 
        success: true,
        message: 'Investment created successfully',
        investment: investResult.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({ success: false, error: 'Failed to create investment' });
  }
});

// Get user investments
router.get('/my-investments', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT ui.*, ip.name as plan_name, ip.daily_roi
       FROM user_investments ui
       JOIN investment_plans ip ON ui.plan_id = ip.id
       WHERE ui.user_id = $1
       ORDER BY ui.created_at DESC`,
      [userId]
    );

    res.json({ success: true, investments: result.rows });
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch investments' });
  }
});

// Get daily returns
router.get('/daily-returns', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT dr.*, ui.amount as investment_amount, ip.name as plan_name
       FROM daily_returns dr
       JOIN user_investments ui ON dr.investment_id = ui.id
       JOIN investment_plans ip ON ui.plan_id = ip.id
       WHERE dr.user_id = $1
       ORDER BY dr.return_date DESC`,
      [userId]
    );

    res.json({ success: true, returns: result.rows });
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch returns' });
  }
});

// Get notifications
router.get('/notifications', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    res.json({ success: true, notifications: result.rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/notification-read/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    const { id } = req.params;

    await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification:', error);
    res.status(500).json({ success: false, error: 'Failed to mark notification' });
  }
});

export default router;
