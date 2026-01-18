-- Normalize all menu item status values to lowercase
-- This fixes legacy data that may have mixed case status values

UPDATE menu_items 
SET status = LOWER(status)
WHERE status IN ('Available', 'Unavailable', 'Sold_out', 'AVAILABLE', 'UNAVAILABLE', 'SOLD_OUT');

-- Verify the update
SELECT DISTINCT status FROM menu_items;

-- Expected results: 'available', 'unavailable', 'sold_out'
