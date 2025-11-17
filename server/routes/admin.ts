import express, { Request, Response } from 'express';
import {
  getAllUsers,
  getUserBalance,
  createDepositRequest,
  createWithdrawalRequest,
  getPendingDepositRequests,
  getPendingWithdrawalRequests,
  approveDepositRequest,
  rejectDepositRequest,
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
  removeUser,
  restoreUser,
  getAdminActivityLog,
  getUserTransactionHistory,
  getAdminDashboardStats,
} from '../utils/adminService.js';
import { sendApprovalEmail, sendRejectionEmail } from '../utils/emailService.js';

const router = express.Router();

// Middleware to verify admin access
const verifyAdmin = (req: Request, res: Response, next: Function) => {
  // TODO: Check if user is admin in JWT token or session
  // For now, we'll assume authorization is done at a higher level
  next();
};

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard statistics
 */
router.get('/dashboard/stats', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await getAdminDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard statistics',
    });
  }
});

/**
 * GET /api/admin/users
 * Get all users with balance information
 */
router.get('/users', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
    });
  }
});

/**
 * GET /api/admin/users/:userId
 * Get specific user balance and info
 */
router.get('/users/:userId', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await getUserBalance(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user information',
    });
  }
});

/**
 * GET /api/admin/deposits/pending
 * Get all pending deposit requests
 */
router.get('/deposits/pending', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const requests = await getPendingDepositRequests();
    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Error getting pending deposits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pending deposits',
    });
  }
});

/**
 * GET /api/admin/withdrawals/pending
 * Get all pending withdrawal requests
 */
router.get('/withdrawals/pending', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const requests = await getPendingWithdrawalRequests();
    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Error getting pending withdrawals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pending withdrawals',
    });
  }
});

/**
 * POST /api/admin/deposits/approve/:requestId
 * Approve a deposit request
 */
router.post('/deposits/approve/:requestId', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const { adminId, notes } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        error: 'Admin ID is required',
      });
    }

    const request = await approveDepositRequest(requestId, adminId, notes || '');

    // Send approval email to user
    try {
      await sendApprovalEmail(
        request.user_id,
        'deposit',
        request.amount,
        request.currency
      );
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Deposit request approved',
      data: request,
    });
  } catch (error) {
    console.error('Error approving deposit:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve deposit',
    });
  }
});

/**
 * POST /api/admin/deposits/reject/:requestId
 * Reject a deposit request
 */
router.post('/deposits/reject/:requestId', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const { adminId, rejectionReason } = req.body;

    if (!adminId || !rejectionReason) {
      return res.status(400).json({
        success: false,
        error: 'Admin ID and rejection reason are required',
      });
    }

    const request = await rejectDepositRequest(requestId, adminId, rejectionReason);

    // Send rejection email to user
    try {
      await sendRejectionEmail(
        request.user_id,
        'deposit',
        request.amount,
        request.currency,
        rejectionReason
      );
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
    }

    res.json({
      success: true,
      message: 'Deposit request rejected',
      data: request,
    });
  } catch (error) {
    console.error('Error rejecting deposit:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject deposit',
    });
  }
});

/**
 * POST /api/admin/withdrawals/approve/:requestId
 * Approve a withdrawal request
 */
router.post('/withdrawals/approve/:requestId', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const { adminId, notes } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        error: 'Admin ID is required',
      });
    }

    const request = await approveWithdrawalRequest(requestId, adminId, notes || '');

    // Send approval email to user
    try {
      await sendApprovalEmail(
        request.user_id,
        'withdrawal',
        request.amount,
        request.currency
      );
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
    }

    res.json({
      success: true,
      message: 'Withdrawal request approved',
      data: request,
    });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve withdrawal',
    });
  }
});

/**
 * POST /api/admin/withdrawals/reject/:requestId
 * Reject a withdrawal request
 */
router.post('/withdrawals/reject/:requestId', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const { adminId, rejectionReason } = req.body;

    if (!adminId || !rejectionReason) {
      return res.status(400).json({
        success: false,
        error: 'Admin ID and rejection reason are required',
      });
    }

    const request = await rejectWithdrawalRequest(requestId, adminId, rejectionReason);

    // Send rejection email to user
    try {
      await sendRejectionEmail(
        request.user_id,
        'withdrawal',
        request.amount,
        request.currency,
        rejectionReason
      );
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
    }

    res.json({
      success: true,
      message: 'Withdrawal request rejected',
      data: request,
    });
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject withdrawal',
    });
  }
});

/**
 * POST /api/admin/users/:userId/remove
 * Remove a user
 */
router.post('/users/:userId/remove', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { adminId, reason } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        error: 'Admin ID is required',
      });
    }

    const result = await removeUser(userId, adminId, reason || '');
    res.json({
      success: true,
      message: 'User removed',
      data: result,
    });
  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove user',
    });
  }
});

/**
 * POST /api/admin/users/:userId/restore
 * Restore a removed user
 */
router.post('/users/:userId/restore', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        error: 'Admin ID is required',
      });
    }

    const result = await restoreUser(userId, adminId);
    res.json({
      success: true,
      message: 'User restored',
      data: result,
    });
  } catch (error) {
    console.error('Error restoring user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore user',
    });
  }
});

/**
 * GET /api/admin/activity-log
 * Get admin activity log
 */
router.get('/activity-log', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const logs = await getAdminActivityLog(limit, offset);
    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error('Error getting activity log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get activity log',
    });
  }
});

/**
 * GET /api/admin/transactions/:userId
 * Get user transaction history
 */
router.get('/transactions/:userId', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const transactions = await getUserTransactionHistory(userId);

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error getting transaction history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get transaction history',
    });
  }
});

export default router;
