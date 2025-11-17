import { Router, Response } from 'express';
import { createRequire } from 'module';
import bcrypt from 'bcryptjs';
import pool from '../db/connection.js';
import { AuthRequest } from '../middleware/auth.js';
import {
  generateVerificationToken,
  getTokenExpiration,
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../utils/emailService.js';

const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');

const router = Router();

interface VerificationBody {
  email: string;
}

interface VerifyTokenBody {
  token: string;
}

interface ResendVerificationBody {
  email: string;
}

/**
 * Request email verification (send verification email)
 * POST /api/email/request-verification
 */
router.post('/request-verification', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body as VerificationBody;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    // Check if user exists with this email
    const userResult = await pool.query(
      'SELECT id, full_name, email, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists
      return res.status(200).json({
        message: 'If email exists, verification link has been sent',
      });
    }

    const user = userResult.rows[0];

    // Check if already verified
    if (user.email_verified) {
      return res.status(200).json({
        message: 'Email already verified',
        verified: true,
      });
    }

    // Generate verification token
    const token = generateVerificationToken();
    const expiresAt = getTokenExpiration(24);

    // Delete any existing tokens for this user
    await pool.query(
      'DELETE FROM email_verification_tokens WHERE user_id = $1',
      [user.id]
    );

    // Insert new verification token
    await pool.query(
      'INSERT INTO email_verification_tokens (user_id, token, email, expires_at) VALUES ($1, $2, $3, $4)',
      [user.id, token, email, expiresAt]
    );

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      user.full_name || 'User',
      token
    );

    // Log the action
    await pool.query(
      'INSERT INTO verification_logs (user_id, action, email, status) VALUES ($1, $2, $3, $4)',
      [
        user.id,
        'email_verification_sent',
        email,
        emailSent ? 'success' : 'failed',
      ]
    );

    if (!emailSent) {
      return res.status(500).json({
        message: 'Failed to send verification email. Please try again later.',
      });
    }

    return res.status(200).json({
      message: 'Verification email sent successfully',
      token, // Return token for testing (remove in production)
    });
  } catch (error) {
    console.error('Request verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Verify email with token
 * POST /api/email/verify-token
 */
router.post('/verify-token', async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body as VerifyTokenBody;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Find the token
    const tokenResult = await pool.query(
      'SELECT * FROM email_verification_tokens WHERE token = $1 AND is_used = FALSE',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    const verificationToken = tokenResult.rows[0];

    // Check if token has expired
    if (new Date() > new Date(verificationToken.expires_at)) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    const userId = verificationToken.user_id;

    // Update user to mark email as verified
    const userResult = await pool.query(
      `UPDATE users 
       SET email_verified = TRUE, 
           email_verified_at = NOW(), 
           email_status = 'verified',
           updated_at = NOW()
       WHERE id = $1 
       RETURNING id, admin_id, email, full_name, role`,
      [userId]
    );

    // Mark token as used
    await pool.query(
      'UPDATE email_verification_tokens SET is_used = TRUE WHERE id = $1',
      [verificationToken.id]
    );

    // Log the verification
    await pool.query(
      'INSERT INTO verification_logs (user_id, action, email, status) VALUES ($1, $2, $3, $4)',
      [userId, 'email_verified', verificationToken.email, 'success']
    );

    const verifiedUser = userResult.rows[0];

    // Create JWT token so the user can be automatically logged in after verifying
    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const authToken = jwt.sign(
        {
          id: verifiedUser.id,
          admin_id: verifiedUser.admin_id,
          role: verifiedUser.role,
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        token: authToken,
        user: {
          id: verifiedUser.id,
          admin_id: verifiedUser.admin_id,
          email: verifiedUser.email,
          full_name: verifiedUser.full_name,
          role: verifiedUser.role,
        },
      });
    } catch (err) {
      console.error('JWT generation error:', err);
      // Fallback: return success without token
      return res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        user: {
          id: verifiedUser.id,
          admin_id: verifiedUser.admin_id,
          email: verifiedUser.email,
          full_name: verifiedUser.full_name,
          role: verifiedUser.role,
        },
      });
    }
  } catch (error) {
    console.error('Verify token error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Resend verification email
 * POST /api/email/resend-verification
 */
router.post('/resend-verification', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body as ResendVerificationBody;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    // Check rate limiting (max 3 attempts per hour)
    const recentAttempts = await pool.query(
      `SELECT COUNT(*) as count FROM verification_logs 
       WHERE email = $1 
       AND action = 'email_verification_sent' 
       AND created_at > NOW() - INTERVAL '1 hour'`,
      [email]
    );

    if (recentAttempts.rows[0].count >= 3) {
      return res.status(429).json({
        message: 'Too many verification requests. Please try again in 1 hour.',
      });
    }

    // Find user
    const userResult = await pool.query(
      'SELECT id, full_name, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(200).json({
        message: 'If email exists, verification link has been sent',
      });
    }

    const user = userResult.rows[0];

    if (user.email_verified) {
      return res.status(200).json({
        message: 'Email already verified',
        verified: true,
      });
    }

    // Generate new token
    const token = generateVerificationToken();
    const expiresAt = getTokenExpiration(24);

    // Delete old tokens
    await pool.query(
      'DELETE FROM email_verification_tokens WHERE user_id = $1',
      [user.id]
    );

    // Insert new token
    await pool.query(
      'INSERT INTO email_verification_tokens (user_id, token, email, expires_at) VALUES ($1, $2, $3, $4)',
      [user.id, token, email, expiresAt]
    );

    // Send email
    const emailSent = await sendVerificationEmail(
      email,
      user.full_name || 'User',
      token
    );

    // Log
    await pool.query(
      'INSERT INTO verification_logs (user_id, action, email, status) VALUES ($1, $2, $3, $4)',
      [user.id, 'email_verification_sent', email, emailSent ? 'success' : 'failed']
    );

    return res.status(200).json({
      message: 'Verification email sent successfully',
      token, // Remove in production
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Check if email is verified
 * GET /api/email/check-verification/:email
 */
router.get('/check-verification/:email', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.params;

    const userResult = await pool.query(
      'SELECT id, email_verified, email_status FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    return res.status(200).json({
      email,
      verified: user.email_verified,
      status: user.email_status,
    });
  } catch (error) {
    console.error('Check verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
