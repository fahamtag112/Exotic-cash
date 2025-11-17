import express, { Request, Response } from 'express';
import {
  createDepositRequest,
  createWithdrawalRequest,
} from '../utils/adminService.js';

const router = express.Router();

/**
 * POST /api/deposits/request
 * User requests a deposit
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

    const depositRequest = await createDepositRequest(userId, amount, currency || 'USD');

    res.status(201).json({
      success: true,
      message: 'Deposit request created successfully',
      data: depositRequest,
    });
  } catch (error) {
    console.error('Error creating deposit request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create deposit request',
    });
  }
});

export default router;
