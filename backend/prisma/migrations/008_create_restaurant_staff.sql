-- Create restaurant_staff table
CREATE TABLE IF NOT EXISTS restaurant_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  CONSTRAINT fk_restaurant_staff_restaurant 
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  CONSTRAINT fk_restaurant_staff_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_restaurant_user 
    UNIQUE (restaurant_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_staff_restaurant ON restaurant_staff(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_staff_user ON restaurant_staff(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_staff_role ON restaurant_staff(role);

-- Add comment
COMMENT ON TABLE restaurant_staff IS 'Maps staff (waiter/kitchen) to their restaurants';
