import express, { Request, Response } from 'express';
import {
  createWithdrawalRequest,
} from '../utils/adminService.js';

const router = express.Router();

/**
 * POST /api/withdrawals/request
 * User requests a withdrawal
 */
router.post('/request', async (req: Request, res: Response) => {
  try {
    const { userId, amount, currency } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters',
      });
    }

    const withdrawalRequest = await createWithdrawalRequest(userId, amount, currency || 'USD');

    res.status(201).json({
      success: true,
      message: 'Withdrawal request created successfully',
      data: withdrawalRequest,
    });
  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create withdrawal request',
    });
  }
});

export default router;
