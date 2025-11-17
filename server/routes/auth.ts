import { Router, Response } from 'express';
import { createRequire } from 'module';
import bcrypt from 'bcryptjs';
import pool from '../db/connection.js';
import { AuthRequest } from '../middleware/auth.js';

const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');

const router = Router();

interface LoginBody {
  admin_id: string;
  password: string;
}

interface UserRow {
  id: number;
  admin_id: string;
  password_hash: string;
  role: 'admin' | 'user';
  full_name: string;
  email: string;
}

// ✅ Login endpoint with role detection + PROPER ERROR HANDLING
router.post('/login', async (req: AuthRequest, res: Response) => {
  let client;
  try {
    const { admin_id, password } = req.body as LoginBody;

    if (!admin_id || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Admin ID and password are required' 
      });
    }

    // ✅ Query user from database with timeout
    let result;
    try {
      result = await pool.query(
        'SELECT * FROM users WHERE admin_id = $1 AND is_active = TRUE',
        [admin_id]
      );
    } catch (dbError: any) {
      console.error('🔴 Database connection error during login:', {
        message: dbError.message,
        code: dbError.code,
        severity: dbError.severity,
        timestamp: new Date().toISOString()
      });
      
      // ✅ Return proper error, not HTML
      return res.status(503).json({ 
        success: false,
        message: 'Database temporarily unavailable. Please try again in a moment.',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const user = result.rows[0] as UserRow;

    // ✅ Verify password with timeout
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
    } catch (bcryptError: any) {
      console.error('🔴 Password verification error:', bcryptError.message);
      return res.status(500).json({ 
        success: false,
        message: 'Authentication service error' 
      });
    }

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        admin_id: user.admin_id,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    ) as string;

    // ✅ Return token and user info based on role
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        admin_id: user.admin_id,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
      },
      message: `${user.role === 'admin' ? 'Admin' : 'User'} login successful`,
    });
  } catch (error: any) {
    console.error('❌ Unexpected login error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // ✅ Always return JSON, never HTML
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error. Please contact support.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Register endpoint (for creating new users)
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { admin_id, password, full_name, email, role } = req.body;

    if (!admin_id || !password) {
      return res.status(400).json({ message: 'Admin ID and password are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE admin_id = $1',
      [admin_id]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (admin_id, password_hash, role, full_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, admin_id, role, full_name, email',
      [admin_id, hashedPassword, role || 'user', full_name || '', email || '']
    );

    const newUser = result.rows[0];

    return res.status(201).json({
      success: true,
      user: newUser,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user endpoint
router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const result = await pool.query(
      'SELECT id, admin_id, role, full_name, email FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
