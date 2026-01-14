-- Add waiter_id column to orders table for waiter performance tracking
-- Migration for Task 3.4 - Advanced Reports

ALTER TABLE orders
ADD COLUMN waiter_id UUID;

-- Add foreign key constraint
ALTER TABLE orders
ADD CONSTRAINT fk_orders_waiter
FOREIGN KEY (waiter_id) REFERENCES users(id);

-- Add index for performance
CREATE INDEX idx_orders_waiter_id ON orders(waiter_id);

-- Update existing orders with NULL waiter_id (optional - they will default to NULL)
-- If you want to assign a default waiter, you can do it here
