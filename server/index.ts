import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import emailRoutes from './routes/email.js';
import adminRoutes from './routes/admin.js';
import depositsRoutes from './routes/deposits.js';
import withdrawalsRoutes from './routes/withdrawals.js';
import investmentRoutes from './routes/investments.js';
import pool, { checkDatabaseHealth, getPoolStats } from './db/connection.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Request logging middleware
app.use((req: Request, res: Response, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    return originalSend.call(this, data);
  };

  next();
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deposits', depositsRoutes);
app.use('/api/withdrawals', withdrawalsRoutes);
app.use('/api/investments', investmentRoutes);

// ✅ CRITICAL: Enhanced health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const isHealthy = await checkDatabaseHealth();
    const poolStats = getPoolStats();

    if (isHealthy) {
      return res.status(200).json({
        success: true,
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
        pool: poolStats
      });
    } else {
      return res.status(503).json({
        success: false,
        status: 'degraded',
        database: 'disconnected',
        message: 'Database connection lost',
        timestamp: new Date().toISOString(),
        pool: poolStats
      });
    }
  } catch (error: any) {
    console.error('❌ Health check failed:', error.message);
    return res.status(503).json({
      success: false,
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// ✅ Pool status endpoint (for monitoring)
app.get('/api/pool-status', (req: Request, res: Response) => {
  const stats = getPoolStats();
  res.status(200).json({
    success: true,
    data: stats
  });
});

// ✅ Server stats endpoint
app.get('/api/stats', (req: Request, res: Response) => {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  
  res.status(200).json({
    success: true,
    data: {
      uptime: `${Math.floor(uptime / 60)} minutes`,
      memory: {
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`
      },
      timestamp: new Date().toISOString()
    }
  });
});

// ✅ Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('❌ Unhandled error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // ✅ Never return HTML to API requests
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// ✅ 404 handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.path}`
  });
});

// ✅ Start server with proper error handling
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'exotic_cash_db'}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Pool Status: http://localhost:${PORT}/api/pool-status`);
  console.log(`💾 Server Stats: http://localhost:${PORT}/api/stats`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // ✅ Verify database connection on startup
  const isHealthy = await checkDatabaseHealth();
  if (!isHealthy) {
    console.error('⚠️  WARNING: Database connection failed on startup!');
    console.error('⚠️  Server is running but API calls may fail');
    console.error('⚠️  Please check:');
    console.error('   1. Is PostgreSQL running? (sudo systemctl status postgresql)');
    console.error('   2. Database exists? (createdb exotic_cash_db)');
    console.error('   3. Credentials correct in .env file?');
  } else {
    console.log('✅ Database connection verified successfully!');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// ✅ Graceful shutdown with connection cleanup
process.on('SIGTERM', () => {
  console.log('📌 SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('🛑 HTTP server closed');
    try {
      await pool.end();
      console.log('🛑 Database connections closed');
    } catch (err) {
      console.error('❌ Error closing pool:', err);
    }
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📌 SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('🛑 HTTP server closed');
    try {
      await pool.end();
      console.log('🛑 Database connections closed');
    } catch (err) {
      console.error('❌ Error closing pool:', err);
    }
    process.exit(0);
  });
});

// ✅ Uncaught exception handler
process.on('uncaughtException', (error: Error) => {
  console.error('❌ UNCAUGHT EXCEPTION:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

// ✅ Unhandled promise rejection
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ UNHANDLED REJECTION:', {
    reason,
    promise,
    timestamp: new Date().toISOString()
  });
});


