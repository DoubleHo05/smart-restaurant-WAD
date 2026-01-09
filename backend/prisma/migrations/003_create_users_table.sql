-- Create users table for authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Add comment
COMMENT ON TABLE users IS 'User accounts for authentication and authorization';
COMMENT ON COLUMN users.role IS 'User role: customer, admin, waiter, kitchen, super_admin';
