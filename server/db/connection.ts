import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// ✅ ENTERPRISE-GRADE CONNECTION POOL CONFIGURATION
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'exotic_cash_db',
  
  // ✅ Connection pool size tuning
  max: 20,                          // Maximum connections (was default 10)
  min: 5,                           // Minimum pool size to keep ready
  
  // ✅ Timeout settings (CRITICAL for 503 fix)
  idleTimeoutMillis: 30000,         // Close idle connections after 30s
  connectionTimeoutMillis: 5000,    // Connection attempt timeout = 5s
  statement_timeout: 30000,         // Query timeout = 30s
  
  // ✅ SSL for production (optional)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  // ✅ Application name for debugging
  application_name: 'exotic-cash-backend',
});

// ✅ CRITICAL: Handle connection errors properly
pool.on('error', (err: any, client: any) => {
  console.error('❌ Unexpected error on idle client:', {
    message: err.message,
    code: err.code || 'UNKNOWN',
    timestamp: new Date().toISOString()
  });
  
  // Don't crash entire process, just log
  if (err.code === 'ECONNREFUSED') {
    console.error('🔴 PostgreSQL refused connection - check if DB is running');
  } else if (err.code === 'ENOTFOUND') {
    console.error('🔴 PostgreSQL host not found - check DB_HOST');
  }
});

// ✅ Connection successful event
pool.on('connect', (client) => {
  console.log('✅ New database connection established');
});

// ✅ Release event logging
pool.on('remove', () => {
  console.log('📌 Connection removed from pool');
});

// ✅ Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database is healthy:', result.rows[0].now);
    return true;
  } catch (error: any) {
    console.error('❌ Database health check failed:', {
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
    return false;
  }
}

// ✅ Get pool stats for monitoring
export function getPoolStats() {
  return {
    total_connections: pool.totalCount,
    idle_connections: pool.idleCount,
    waiting_queries: pool.waitingCount,
    timestamp: new Date().toISOString()
  };
}

export default pool;
