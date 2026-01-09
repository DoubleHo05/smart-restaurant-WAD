-- Add missing columns to users table

-- Check if name column doesn't exist, then add it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='name') THEN
    ALTER TABLE users ADD COLUMN name VARCHAR(100);
  END IF;
END $$;

-- Check if phone column doesn't exist, then add it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='phone') THEN
    ALTER TABLE users ADD COLUMN phone VARCHAR(20);
  END IF;
END $$;

-- Check if role column doesn't exist, then add it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='role') THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'customer';
  END IF;
END $$;

-- Check if is_active column doesn't exist, then add it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='is_active') THEN
    ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;

-- Check if password_hash exists, if not rename password to password_hash
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='password_hash') 
     AND EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='password') THEN
    ALTER TABLE users RENAME COLUMN password TO password_hash;
  END IF;
END $$;

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Add comments
COMMENT ON COLUMN users.name IS 'User full name';
COMMENT ON COLUMN users.phone IS 'User phone number (optional)';
COMMENT ON COLUMN users.role IS 'User role: customer, admin, waiter, kitchen, super_admin';
COMMENT ON COLUMN users.is_active IS 'Whether the user account is active';
