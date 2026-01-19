-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing data first
-- Using CASCADE to clean dependent tables automatically
TRUNCATE TABLE 
    users,
    restaurants,
    roles,
    payment_methods,
    carts
RESTART IDENTITY CASCADE;

-- Start the transactional data generation
DO $$
DECLARE
    -- ID Variables
    v_owner_id UUID;
    v_cust_ids UUID[]; -- Array to store customer IDs
    v_rest_id UUID;
    v_cat_ids UUID[];
    v_item_id UUID;
    v_mod_group_id UUID;
    
    -- Loop counters
    i INT;
    j INT;
    k INT;
    r INT; -- review loop
    
    -- Review helpers
    v_rating INT;
    v_total_rating DECIMAL(10,2);
    v_random_cust_id UUID;
    
    -- Helper data
    v_categories text[] := ARRAY['Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống'];
    v_dish_prefixes text[] := ARRAY['Gà', 'Bò', 'Heo', 'Cá', 'Tôm', 'Mực', 'Rau', 'Nấm', 'Đậu', 'Cơm'];
    v_adjectives text[] := ARRAY['Chiên giòn', 'Nướng mắm', 'Xào tỏi', 'Hấp bia', 'Rang muối', 'Sốt chua ngọt', 'Kho tộ', 'Nấu canh', 'Trộn gỏi', 'Lắc phô mai'];

BEGIN
    -- =============================================
    -- 1. MASTER DATA
    -- =============================================
    
    -- Create Payment Methods
    INSERT INTO payment_methods (code, name, description, is_active) VALUES
    ('CASH', 'Tiền mặt', 'Thanh toán bằng tiền mặt tại quầy', true),
    ('VNPAY', 'VNPay', 'Thanh toán qua ví VNPay', true);

    -- Create Roles
    INSERT INTO roles (name, description) VALUES ('owner', 'Chủ nhà hàng'), ('staff', 'Nhân viên'), ('customer', 'Khách hàng');

    -- =============================================
    -- 2. USERS
    -- =============================================
    
    -- Create Owner
    INSERT INTO users (email, full_name, password_hash, status, email_verified, updated_at)
    VALUES ('owner@example.com', 'Admin Owner', '$2b$10$EpIxT.idx.valid.hash', 'active', true, NOW())
    RETURNING id INTO v_owner_id;

    -- Create 5 Customers for Reviews
    -- Initialize array
    v_cust_ids := ARRAY[]::UUID[];
    FOR i IN 1..5 LOOP
        INSERT INTO users (email, full_name, password_hash, status, email_verified, updated_at)
        VALUES (format('customer%s@example.com', i), format('Customer %s', i), '$2b$10$EpIxT.idx.valid.hash', 'active', true, NOW())
        RETURNING id INTO v_cust_ids[i];
    END LOOP;

    -- =============================================
    -- 3. RESTAURANTS GENERATION
    -- =============================================
    
    FOR i IN 1..5 LOOP
        -- Create Restaurant
        INSERT INTO restaurants (name, address, phone, owner_id, status)
        VALUES (
            format('Nhà hàng Ngon Số %s', i), 
            format('123 Đường Số %s, Quận 1, TP.HCM', i),
            format('090900000%s', i),
            v_owner_id,
            'active'
        )
        RETURNING id INTO v_rest_id;

        -- Create 5 Tables for this Restaurant
        FOR j IN 1..5 LOOP
            INSERT INTO tables (table_number, capacity, location, status, restaurant_id, qr_token)
            VALUES (
                format('Bàn %s', j),
                4,
                CASE WHEN j <= 2 THEN 'Ngoài trời' ELSE 'Trong nhà' END,
                'active',
                v_rest_id,
                encode(digest(format('%s-%s-%s', v_rest_id, j, now()), 'sha256'), 'hex') -- Fake QR token
            );
        END LOOP;

        -- Create Categories for this Restaurant
        v_cat_ids := ARRAY[]::UUID[];
        FOREACH k IN ARRAY v_categories LOOP
            INSERT INTO menu_categories (restaurant_id, name, display_order)
            VALUES (v_rest_id, k, 1)
            RETURNING id INTO v_cat_ids[array_length(v_cat_ids, 1) + 1];
        END LOOP;

        -- Create "Size" Modifier Group for this Restaurant
        INSERT INTO modifier_groups (restaurant_id, name, selection_type, is_required, min_selections, max_selections)
        VALUES (v_rest_id, 'Size', 'single', true, 1, 1)
        RETURNING id INTO v_mod_group_id;

        -- Create Options for the Modifier Group
        INSERT INTO modifier_options (group_id, name, price_adjustment) VALUES 
        (v_mod_group_id, 'Nhỏ', 0),
        (v_mod_group_id, 'Vừa', 10000),
        (v_mod_group_id, 'Lớn', 20000);

        -- =============================================
        -- 4. MENU ITEMS GENERATION (40 Items/Rest)
        -- =============================================
        FOR j IN 1..40 LOOP
            -- Create Menu Item
            INSERT INTO menu_items (
                restaurant_id, 
                category_id, 
                name, 
                description, 
                price, 
                status, 
                is_chef_recommended,
                average_rating,
                review_count
            )
            VALUES (
                v_rest_id,
                v_cat_ids[(j % 4) + 1], -- Distribute across categories
                format('%s %s', v_dish_prefixes[(j % 10) + 1], v_adjectives[(j % 10) + 1]),
                'Món ăn thơm ngon đậm đà hương vị truyền thống',
                (floor(random() * 20) + 5) * 10000, -- Random price 50k - 250k
                'active',
                (j % 5 = 0), -- Every 5th item is recommended
                0, -- Will update after reviews
                0
            )
            RETURNING id INTO v_item_id;

            -- Link "Size" Modifier to Item
            INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
            VALUES (v_item_id, v_mod_group_id);

            -- Create Photo (Placeholder)
            INSERT INTO menu_item_photos (menu_item_id, url, is_primary)
            VALUES (v_item_id, 'https://placehold.co/600x400?text=Food', true);

            -- =============================================
            -- 5. REVIEWS GENERATION (5 Reviews/Item)
            -- =============================================
            v_total_rating := 0;
            
            FOR r IN 1..5 LOOP
                v_rating := floor(random() * 3) + 3; -- Random rating 3-5
                v_total_rating := v_total_rating + v_rating;
                v_random_cust_id := v_cust_ids[r]; -- Use customer from array

                INSERT INTO reviews (menu_item_id, user_id, rating, comment)
                VALUES (
                    v_item_id, 
                    v_random_cust_id, 
                    v_rating, 
                    CASE v_rating 
                        WHEN 5 THEN 'Tuyệt vời, sẽ quay lại!'
                        WHEN 4 THEN 'Rất ngon nhưng phục vụ hơi chậm.'
                        WHEN 3 THEN 'Hương vị bình thường.'
                        ELSE 'Cần cải thiện.'
                    END
                );
            END LOOP;

            -- Update Menu Item Statistics
            UPDATE menu_items 
            SET average_rating = v_total_rating / 5.0,
                review_count = 5
            WHERE id = v_item_id;

        END LOOP; -- End Items Loop (40)
        
    END LOOP; -- End Restaurants Loop (5)

END $$;
