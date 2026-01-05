-- ============================================
-- Menu Management System - Sample Data
-- Restaurant: Vietnamese Restaurant
-- ============================================

-- Clear existing data (optional - uncomment if needed)
DELETE FROM menu_item_modifier_groups;
DELETE FROM modifier_options;
DELETE FROM modifier_groups;
DELETE FROM menu_item_photos;
DELETE FROM menu_items;
DELETE FROM menu_categories;
DELETE FROM tables;

-- ============================================
-- 1. TABLES DATA
-- ============================================

INSERT INTO tables (id, table_number, capacity, location, description, status, created_at, updated_at)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01'::uuid, 'T01', 2, 'Window Side', 'Small table by the window', 'active', NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02'::uuid, 'T02', 4, 'Main Hall', 'Family table in main dining area', 'active', NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03'::uuid, 'T03', 6, 'Main Hall', 'Large table for groups', 'active', NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04'::uuid, 'T04', 2, 'Corner', 'Quiet corner table', 'active', NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05'::uuid, 'T05', 4, 'Patio', 'Outdoor seating', 'active', NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06'::uuid, 'T06', 8, 'Private Room', 'VIP private dining room', 'active', NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07'::uuid, 'T07', 4, 'Main Hall', 'Standard table', 'active', NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08'::uuid, 'T08', 2, 'Bar Area', 'High table near bar', 'active', NOW(), NOW());

-- ============================================
-- 2. MENU CATEGORIES
-- ============================================

INSERT INTO menu_categories (id, restaurant_id, name, description, display_order, status, created_at, updated_at)
VALUES 
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Appetizers', 'Start your meal with our delicious appetizers', 1, 'active', NOW(), NOW()),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Soups & Noodles', 'Traditional Vietnamese soups and noodle dishes', 2, 'active', NOW(), NOW()),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Rice Dishes', 'Hearty rice-based main courses', 3, 'active', NOW(), NOW()),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Bánh Mì', 'Vietnamese sandwiches', 4, 'active', NOW(), NOW()),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Beverages', 'Refreshing drinks', 5, 'active', NOW(), NOW()),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b06'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Desserts', 'Sweet endings to your meal', 6, 'active', NOW(), NOW());

-- ============================================
-- 3. MODIFIER GROUPS
-- ============================================

INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, display_order, status, created_at, updated_at)
VALUES 
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Size', 'single', true, 1, 1, 1, 'active', NOW(), NOW()),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Spice Level', 'single', false, 0, 1, 2, 'active', NOW(), NOW()),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Extra Toppings', 'multiple', false, 0, 5, 3, 'active', NOW(), NOW()),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Protein Choice', 'single', true, 1, 1, 4, 'active', NOW(), NOW()),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Ice Level', 'single', false, 0, 1, 5, 'active', NOW(), NOW()),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Sugar Level', 'single', false, 0, 1, 6, 'active', NOW(), NOW());

-- ============================================
-- 4. MODIFIER OPTIONS
-- ============================================

-- Size options
INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
VALUES 
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01'::uuid, 'Small', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d02'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01'::uuid, 'Medium', 5000, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01'::uuid, 'Large', 10000, 'active', NOW());

-- Spice Level options
INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
VALUES 
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02'::uuid, 'Mild', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02'::uuid, 'Medium', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02'::uuid, 'Hot', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02'::uuid, 'Extra Hot', 0, 'active', NOW());

-- Extra Toppings options
INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
VALUES 
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d21'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid, 'Extra Meat', 15000, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d22'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid, 'Extra Vegetables', 5000, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d23'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid, 'Fried Egg', 5000, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d24'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid, 'Fresh Herbs', 3000, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d25'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid, 'Crushed Peanuts', 3000, 'active', NOW());

-- Protein Choice options
INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
VALUES 
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d31'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04'::uuid, 'Beef', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d32'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04'::uuid, 'Chicken', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d33'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04'::uuid, 'Pork', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d34'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04'::uuid, 'Seafood', 10000, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d35'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04'::uuid, 'Tofu (Vegetarian)', 0, 'active', NOW());

-- Ice Level options
INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
VALUES 
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d41'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'::uuid, 'No Ice', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d42'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'::uuid, 'Less Ice', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d43'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'::uuid, 'Normal Ice', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'::uuid, 'Extra Ice', 0, 'active', NOW());

-- Sugar Level options
INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
VALUES 
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d51'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06'::uuid, '0% Sugar', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d52'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06'::uuid, '25% Sugar', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06'::uuid, '50% Sugar', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d54'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06'::uuid, '75% Sugar', 0, 'active', NOW()),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d55'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06'::uuid, '100% Sugar', 0, 'active', NOW());

-- ============================================
-- 5. MENU ITEMS
-- ============================================

-- APPETIZERS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01'::uuid, 
   'Gỏi Cuốn (Spring Rolls)', 'Fresh spring rolls with shrimp, pork, and vegetables wrapped in rice paper', 
   25000, 5, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e02'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01'::uuid, 
   'Chả Giò (Fried Spring Rolls)', 'Crispy fried rolls filled with pork, shrimp, and vegetables', 
   30000, 10, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e03'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01'::uuid, 
   'Nem Nướng (Grilled Pork Sausage)', 'Grilled Vietnamese pork sausage served with fresh herbs', 
   35000, 8, 'available', false, false, NOW(), NOW());

-- SOUPS & NOODLES
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02'::uuid, 
   'Phở Bò (Beef Noodle Soup)', 'Traditional Vietnamese beef noodle soup with rice noodles, tender beef, and aromatic herbs', 
   55000, 15, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02'::uuid, 
   'Phở Gà (Chicken Noodle Soup)', 'Light and flavorful chicken noodle soup with fresh herbs', 
   50000, 15, 'available', false, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e13'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02'::uuid, 
   'Bún Bò Huế', 'Spicy beef noodle soup from Hue with thick rice noodles', 
   60000, 20, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e14'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02'::uuid, 
   'Bún Chả', 'Grilled pork with vermicelli noodles and dipping sauce', 
   45000, 18, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e15'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02'::uuid, 
   'Hủ Tiếu Nam Vang', 'Clear pork and seafood noodle soup with mixed toppings', 
   50000, 15, 'available', false, false, NOW(), NOW());

-- RICE DISHES
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03'::uuid, 
   'Cơm Tấm Sườn Nướng', 'Broken rice with grilled pork chop, fried egg, and pickled vegetables', 
   45000, 12, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e22'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03'::uuid, 
   'Cơm Gà Xối Mỡ', 'Steamed rice with poached chicken and special sauce', 
   50000, 15, 'available', false, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e23'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03'::uuid, 
   'Cơm Chiên Dương Châu', 'Yang Chow fried rice with shrimp, pork, and vegetables', 
   40000, 10, 'available', false, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e24'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03'::uuid, 
   'Cơm Bò Lúc Lắc', 'Shaking beef with steamed rice and fresh salad', 
   65000, 15, 'available', true, false, NOW(), NOW());

-- BÁNH MÌ
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04'::uuid, 
   'Bánh Mì Thịt Nướng', 'Grilled pork Vietnamese sandwich with fresh vegetables and herbs', 
   35000, 8, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e32'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04'::uuid, 
   'Bánh Mì Gà', 'Chicken Vietnamese sandwich with pickled vegetables', 
   30000, 8, 'available', false, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e33'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04'::uuid, 
   'Bánh Mì Pate', 'Classic Vietnamese sandwich with pate and cold cuts', 
   25000, 5, 'available', false, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e34'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04'::uuid, 
   'Bánh Mì Chay (Vegetarian)', 'Vegetarian sandwich with tofu and fresh vegetables', 
   28000, 7, 'available', false, false, NOW(), NOW());

-- BEVERAGES
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05'::uuid, 
   'Cà Phê Sữa Đá', 'Vietnamese iced coffee with condensed milk', 
   25000, 5, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e42'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05'::uuid, 
   'Cà Phê Đen Đá', 'Vietnamese iced black coffee', 
   20000, 5, 'available', false, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e43'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05'::uuid, 
   'Trà Đá', 'Iced Vietnamese tea', 
   10000, 3, 'available', false, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e44'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05'::uuid, 
   'Sinh Tố Bơ', 'Avocado smoothie', 
   30000, 5, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e45'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05'::uuid, 
   'Nước Chanh', 'Fresh lemonade', 
   15000, 3, 'available', false, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e46'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05'::uuid, 
   'Nước Dừa', 'Fresh coconut water', 
   20000, 3, 'available', false, false, NOW(), NOW());

-- DESSERTS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended, is_deleted, created_at, updated_at)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b06'::uuid, 
   'Chè Ba Màu', 'Three-color dessert with beans, jelly, and coconut milk', 
   25000, 5, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b06'::uuid, 
   'Chè Thái', 'Thai-style mixed dessert with fruits and coconut milk', 
   30000, 5, 'available', true, false, NOW(), NOW()),
   
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e53'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b06'::uuid, 
   'Kem Xôi', 'Sticky rice with ice cream', 
   20000, 5, 'available', false, false, NOW(), NOW());

-- ============================================
-- 6. MENU ITEM MODIFIER GROUPS (Associations)
-- ============================================

-- Phở Bò - Size, Spice Level, Extra Toppings
INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid);

-- Phở Gà - Size, Extra Toppings
INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid);

-- Bún Bò Huế - Size, Spice Level, Extra Toppings
INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e13'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e13'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e13'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid);

-- Bún Chả - Size, Extra Toppings
INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e14'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e14'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid);

-- Cơm Tấm - Protein Choice, Extra Toppings
INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid);

-- Cơm Chiên - Extra Toppings
INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e23'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03'::uuid);

-- Bánh Mì - Spice Level
INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e32'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02'::uuid);

-- Beverages - Ice Level, Sugar Level
INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e42'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e44'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e44'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06'::uuid),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e45'::uuid, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'::uuid);

-- ============================================
-- 7. MENU ITEM PHOTOS (Sample URLs - replace with real images)
-- ============================================

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
VALUES 
  -- Phở Bò
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f01'::uuid, 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'::uuid, 
   'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', true, NOW()),
   
  -- Bún Chả
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f02'::uuid, 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e14'::uuid, 
   'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', true, NOW()),
   
  -- Cơm Tấm
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f03'::uuid, 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21'::uuid, 
   'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400', true, NOW()),
   
  -- Bánh Mì
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f04'::uuid, 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31'::uuid, 
   'https://images.unsplash.com/photo-1591181520189-abcb0735c65d?w=400', true, NOW()),
   
  -- Cà Phê
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f05'::uuid, 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41'::uuid, 
   'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', true, NOW()),
   
  -- Spring Rolls
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f06'::uuid, 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01'::uuid, 
   'https://images.unsplash.com/photo-1529928520614-7781a7b29529?w=400', true, NOW());

-- ============================================
-- SUMMARY
-- ============================================
-- Tables: 8 tables
-- Categories: 6 categories
-- Modifier Groups: 6 groups
-- Modifier Options: 27 options
-- Menu Items: 25 items
-- Photos: 6 sample photos
-- Associations: Multiple item-modifier relationships
-- ============================================

-- Verify data
SELECT 'Tables' AS entity, COUNT(*) AS count FROM tables
UNION ALL
SELECT 'Categories', COUNT(*) FROM menu_categories
UNION ALL
SELECT 'Modifier Groups', COUNT(*) FROM modifier_groups
UNION ALL
SELECT 'Modifier Options', COUNT(*) FROM modifier_options
UNION ALL
SELECT 'Menu Items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'Menu Photos', COUNT(*) FROM menu_item_photos
UNION ALL
SELECT 'Item-Modifier Associations', COUNT(*) FROM menu_item_modifier_groups;

-- Quick verification queries
-- SELECT * FROM menu_categories ORDER BY display_order;
-- SELECT name, price, status, is_chef_recommended FROM menu_items ORDER BY category_id, name;
-- SELECT mg.name as group_name, mo.name as option_name, mo.price_adjustment 
-- FROM modifier_groups mg JOIN modifier_options mo ON mg.id = mo.group_id 
-- ORDER BY mg.name, mo.name;
