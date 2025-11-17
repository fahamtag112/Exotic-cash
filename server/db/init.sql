-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS exotic_cash_db;

-- Connect to the database
\c exotic_cash_db;

-- Create ENUM type for user roles
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  admin_id VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  full_name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_admin_id ON users(admin_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert sample data with proper bcrypt hashes
INSERT INTO users (admin_id, password_hash, role, full_name, email) VALUES
('Admin112', '$2b$10$qRVRHYu0j.gBmVsyB76wwuffzqLhFp4mm8ewq0lZmaZ9HEr6mNFyu', 'admin', 'Administrator', 'admin@exoticcash.com'),
('User001', '$2b$10$Iux02YjVKb2jVrtqKq5kEucfKja83xDxuD1NKruULWI/T1AY3kWeu', 'user', 'John Doe', 'john@exoticcash.com')
ON CONFLICT (admin_id) DO NOTHING;

-- Note: Passwords are hashed with bcrypt
-- Admin Credentials: AdminId: Admin112, Password: Admin@112
-- User Credentials: AdminId: User001, Password: User@123
