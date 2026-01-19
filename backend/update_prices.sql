-- Update menu items price
UPDATE menu_items 
SET price = price * 1000;

-- Update modifier options price adjustment
UPDATE modifier_options 
SET price_adjustment = price_adjustment * 1000;

-- Optional: Verify the changes
-- SELECT name, price FROM menu_items LIMIT 5;
