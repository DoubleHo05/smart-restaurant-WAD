-- ============================================
-- Sample Data for Customer Menu Testing
-- ============================================
-- Insert this data into your Supabase database
-- Or run via psql: psql -U postgres -d your_db -f sample-menu-data.sql

-- ============================================
-- 1. INSERT MENU CATEGORIES
-- ============================================

INSERT INTO menu_categories (id, restaurant_id, name, description, display_order, status, created_at, updated_at)
VALUES 
  (gen_random_uuid(), gen_random_uuid(), 'Appetizers', 'Start your meal with our delicious starters', 1, 'active', NOW(), NOW()),
  (gen_random_uuid(), gen_random_uuid(), 'Main Dishes', 'Our signature main courses', 2, 'active', NOW(), NOW()),
  (gen_random_uuid(), gen_random_uuid(), 'Drinks', 'Refreshing beverages', 3, 'active', NOW(), NOW()),
  (gen_random_uuid(), gen_random_uuid(), 'Desserts', 'Sweet endings to your meal', 4, 'active', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. INSERT MENU ITEMS
-- ============================================

-- Get category IDs for reference
DO $$
DECLARE
  appetizers_id UUID;
  mains_id UUID;
  drinks_id UUID;
  desserts_id UUID;
  restaurant_id UUID;
BEGIN
  -- Get or create restaurant_id
  restaurant_id := gen_random_uuid();
  
  -- Get category IDs
  SELECT id INTO appetizers_id FROM menu_categories WHERE name = 'Appetizers' LIMIT 1;
  SELECT id INTO mains_id FROM menu_categories WHERE name = 'Main Dishes' LIMIT 1;
  SELECT id INTO drinks_id FROM menu_categories WHERE name = 'Drinks' LIMIT 1;
  SELECT id INTO desserts_id FROM menu_categories WHERE name = 'Desserts' LIMIT 1;

  -- INSERT APPETIZERS
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
  VALUES 
    (gen_random_uuid(), restaurant_id, appetizers_id, 'Caesar Salad', 'Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing', 12.50, 10, 'active', true, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, appetizers_id, 'Buffalo Wings', 'Crispy chicken wings tossed in spicy buffalo sauce, served with ranch', 14.99, 15, 'active', false, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, appetizers_id, 'Spring Rolls', 'Fresh vegetable spring rolls with sweet chili dipping sauce', 9.99, 8, 'active', false, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, appetizers_id, 'Bruschetta', 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil', 11.50, 10, 'active', false, false, NOW(), NOW());

  -- INSERT MAIN DISHES
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
  VALUES 
    (gen_random_uuid(), restaurant_id, mains_id, 'Grilled Salmon', 'Fresh Atlantic salmon grilled to perfection, served with vegetables', 24.99, 20, 'active', true, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, mains_id, 'Ribeye Steak', 'Premium 12oz ribeye steak with mashed potatoes and seasonal vegetables', 32.99, 25, 'active', true, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, mains_id, 'Chicken Parmesan', 'Breaded chicken breast topped with marinara sauce and melted cheese', 18.99, 22, 'active', false, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, mains_id, 'Vegetarian Pasta', 'Penne pasta with fresh vegetables in creamy alfredo sauce', 16.50, 18, 'active', false, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, mains_id, 'Fish and Chips', 'Beer-battered cod with crispy fries and tartar sauce', 19.99, 20, 'active', false, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, mains_id, 'BBQ Ribs', 'Slow-cooked baby back ribs with BBQ sauce and coleslaw', 26.99, 30, 'active', true, false, NOW(), NOW());

  -- INSERT DRINKS
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
  VALUES 
    (gen_random_uuid(), restaurant_id, drinks_id, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 5.99, 3, 'active', false, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, drinks_id, 'Iced Coffee', 'Cold brew coffee served over ice', 4.50, 2, 'active', false, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, drinks_id, 'Mango Smoothie', 'Fresh mango blended with yogurt and honey', 6.99, 5, 'active', true, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, drinks_id, 'Coca Cola', 'Classic Coca Cola', 2.99, 1, 'active', false, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, drinks_id, 'Green Tea', 'Hot or iced green tea', 3.50, 3, 'active', false, false, NOW(), NOW());

  -- INSERT DESSERTS
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
  VALUES 
    (gen_random_uuid(), restaurant_id, desserts_id, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 8.99, 12, 'active', true, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, desserts_id, 'Tiramisu', 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone', 7.99, 5, 'active', true, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, desserts_id, 'Cheesecake', 'New York style cheesecake with berry compote', 7.50, 5, 'active', false, false, NOW(), NOW()),
    (gen_random_uuid(), restaurant_id, desserts_id, 'Ice Cream Sundae', 'Three scoops of ice cream with toppings and whipped cream', 6.99, 5, 'active', false, false, NOW(), NOW());

END $$;

-- ============================================
-- 3. INSERT MODIFIER GROUPS (Optional)
-- ============================================

DO $$
DECLARE
  restaurant_id UUID;
  cooking_group_id UUID;
  sides_group_id UUID;
  size_group_id UUID;
BEGIN
  restaurant_id := gen_random_uuid();

  -- Cooking Style Group
  INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, display_order, status, created_at, updated_at)
  VALUES (gen_random_uuid(), restaurant_id, 'Cooking Style', 'single', true, 1, 1, 1, 'active', NOW(), NOW())
  RETURNING id INTO cooking_group_id;

  INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
  VALUES 
    (gen_random_uuid(), cooking_group_id, 'Rare', 0, 'active', NOW()),
    (gen_random_uuid(), cooking_group_id, 'Medium Rare', 0, 'active', NOW()),
    (gen_random_uuid(), cooking_group_id, 'Medium', 0, 'active', NOW()),
    (gen_random_uuid(), cooking_group_id, 'Well Done', 0, 'active', NOW());

  -- Side Dishes Group
  INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, display_order, status, created_at, updated_at)
  VALUES (gen_random_uuid(), restaurant_id, 'Choose Your Side', 'single', false, 0, 2, 2, 'active', NOW(), NOW())
  RETURNING id INTO sides_group_id;

  INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
  VALUES 
    (gen_random_uuid(), sides_group_id, 'French Fries', 0, 'active', NOW()),
    (gen_random_uuid(), sides_group_id, 'Mashed Potatoes', 0, 'active', NOW()),
    (gen_random_uuid(), sides_group_id, 'Steamed Vegetables', 0, 'active', NOW()),
    (gen_random_uuid(), sides_group_id, 'Caesar Salad', 2.50, 'active', NOW()),
    (gen_random_uuid(), sides_group_id, 'Sweet Potato Fries', 1.50, 'active', NOW());

  -- Drink Size Group
  INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, display_order, status, created_at, updated_at)
  VALUES (gen_random_uuid(), restaurant_id, 'Size', 'single', true, 1, 1, 1, 'active', NOW(), NOW())
  RETURNING id INTO size_group_id;

  INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
  VALUES 
    (gen_random_uuid(), size_group_id, 'Small', 0, 'active', NOW()),
    (gen_random_uuid(), size_group_id, 'Medium', 1.00, 'active', NOW()),
    (gen_random_uuid(), size_group_id, 'Large', 2.00, 'active', NOW());

END $$;

-- ============================================
-- 4. INSERT SAMPLE TABLES (if not exists)
-- ============================================

INSERT INTO tables (id, table_number, capacity, location, description, status, created_at, updated_at)
VALUES 
  (gen_random_uuid(), '1', 2, 'Window Side', 'Cozy table for two by the window', 'active', NOW(), NOW()),
  (gen_random_uuid(), '2', 4, 'Main Hall', 'Family table in the main dining area', 'active', NOW(), NOW()),
  (gen_random_uuid(), '3', 4, 'Patio', 'Outdoor seating with garden view', 'active', NOW(), NOW()),
  (gen_random_uuid(), '4', 6, 'Main Hall', 'Large table for groups', 'active', NOW(), NOW()),
  (gen_random_uuid(), '5', 4, 'Window Side', 'Table with street view', 'active', NOW(), NOW()),
  (gen_random_uuid(), '6', 2, 'Bar Area', 'High table near the bar', 'active', NOW(), NOW()),
  (gen_random_uuid(), '7', 8, 'Private Room', 'Private dining room', 'active', NOW(), NOW()),
  (gen_random_uuid(), '8', 4, 'Main Hall', 'Central table', 'active', NOW(), NOW())
ON CONFLICT (table_number) DO NOTHING;

-- ============================================
-- 5. VERIFY DATA
-- ============================================

-- Check categories
SELECT 
  'Categories' as table_name,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count
FROM menu_categories;

-- Check menu items
SELECT 
  'Menu Items' as table_name,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
  COUNT(CASE WHEN is_chef_recommended THEN 1 END) as chef_recommended
FROM menu_items;

-- Check items per category
SELECT 
  mc.name as category,
  COUNT(mi.id) as item_count
FROM menu_categories mc
LEFT JOIN menu_items mi ON mc.id = mi.category_id AND mi.status = 'active'
WHERE mc.status = 'active'
GROUP BY mc.name, mc.display_order
ORDER BY mc.display_order;

-- Check tables
SELECT 
  'Tables' as table_name,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count
FROM tables;

-- ============================================
-- DONE! 🎉
-- ============================================
-- You should now have:
-- - 4 categories (Appetizers, Main Dishes, Drinks, Desserts)
-- - ~20 menu items across categories
-- - 3 modifier groups with options
-- - 8 sample tables
--
-- Test with:
-- SELECT * FROM menu_categories;
-- SELECT * FROM menu_items ORDER BY category_id;
-- SELECT * FROM tables;
-- ============================================
