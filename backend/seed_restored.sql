TRUNCATE TABLE users, roles, restaurants, tables, menu_categories, modifier_groups, modifier_options, menu_items, menu_item_modifier_groups, menu_item_photos, reviews, user_roles RESTART IDENTITY CASCADE;
INSERT INTO roles (id, name, description) VALUES ('c6bafb39-a28b-4b77-885a-ca90568da431', 'admin', 'Administrator role');
INSERT INTO roles (id, name, description) VALUES ('9518e0c2-026b-4673-8f30-0deee93a21da', 'customer', 'Customer role');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('6d110905-3547-48ba-9396-b90749f8897f', 'admin1@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Admin User 1', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('6d110905-3547-48ba-9396-b90749f8897f', 'c6bafb39-a28b-4b77-885a-ca90568da431');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('ca9cd675-3ad8-4236-a54e-52b4d29814ba', 'admin2@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Admin User 2', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('ca9cd675-3ad8-4236-a54e-52b4d29814ba', 'c6bafb39-a28b-4b77-885a-ca90568da431');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('8af26781-459a-4a30-8179-4fa011856da6', 'admin3@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Admin User 3', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('8af26781-459a-4a30-8179-4fa011856da6', 'c6bafb39-a28b-4b77-885a-ca90568da431');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('0049434d-6b20-48ec-a4cd-23dbbfb88d28', 'admin4@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Admin User 4', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('0049434d-6b20-48ec-a4cd-23dbbfb88d28', 'c6bafb39-a28b-4b77-885a-ca90568da431');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('858e6235-017d-4d3e-bf05-e771d74cbca7', 'admin5@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Admin User 5', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('858e6235-017d-4d3e-bf05-e771d74cbca7', 'c6bafb39-a28b-4b77-885a-ca90568da431');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('433ed30a-e381-4bb6-adb7-715ded5a5d47', 'customer1@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 1', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('433ed30a-e381-4bb6-adb7-715ded5a5d47', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('d678408b-1c7e-4a14-80ca-dce1d38a9cb0', 'customer2@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 2', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('d678408b-1c7e-4a14-80ca-dce1d38a9cb0', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('d0087c90-7e3a-4536-91df-e26625a09e81', 'customer3@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 3', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('d0087c90-7e3a-4536-91df-e26625a09e81', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('6984f761-58ee-4f92-be4e-9398219ec041', 'customer4@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 4', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('6984f761-58ee-4f92-be4e-9398219ec041', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('8e3da32e-ad4d-4b34-a9c4-8a851a105049', 'customer5@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 5', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('8e3da32e-ad4d-4b34-a9c4-8a851a105049', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('cfee657d-5498-4806-9e43-22f580596971', 'customer6@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 6', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('cfee657d-5498-4806-9e43-22f580596971', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('80872ac3-d4df-4075-9fa1-0a64d30d2773', 'customer7@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 7', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('80872ac3-d4df-4075-9fa1-0a64d30d2773', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('01a191d7-0785-4aa9-ad88-0952176154a9', 'customer8@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 8', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('01a191d7-0785-4aa9-ad88-0952176154a9', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('4682ce25-59d7-4cb6-b69a-8b50f415290b', 'customer9@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 9', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('4682ce25-59d7-4cb6-b69a-8b50f415290b', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO users (id, email, password_hash, full_name, status, created_at, updated_at)
        VALUES ('fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 'customer10@example.com', '$2b$10$5somehashstringthatlooksvalid.......................', 'Customer User 10', 'active', NOW(), NOW());
        
INSERT INTO user_roles (user_id, role_id) VALUES ('fb2a5e7f-9733-437e-b218-2d88e5ab0a01', '9518e0c2-026b-4673-8f30-0deee93a21da');

        INSERT INTO restaurants (id, name, address, owner_id, status, created_at, updated_at)
        VALUES ('89c2a5cf-eb82-4722-bdaa-58d2abf57a57', 'Gusteau''s', '123 Gusteau''s St.', '6d110905-3547-48ba-9396-b90749f8897f', 'active', NOW(), NOW());
        

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('88ed227d-ee57-4801-8ede-ec56b3f299fb', 'T1', 6, 'Main Hall', 'active', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('9dcc9444-5f15-4247-b9c6-a7849ea22b44', 'T2', 8, 'Main Hall', 'active', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('fc87e100-c01b-41c7-ba33-19cd6b7b5c30', 'T3', 2, 'Main Hall', 'active', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('8f558ab0-fd66-432f-beb0-91a299eddac0', 'T4', 4, 'Main Hall', 'active', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('797bf955-2787-4d3f-b68a-23d31773ef12', 'T5', 4, 'Main Hall', 'active', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', 'Appetizers', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('52da13fa-f9f6-4732-9e51-4239d140c939', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', 'Main Course', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('8e974697-03ea-492d-b08b-d8a42f9c8014', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', 'Desserts', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('73912d93-0154-4409-a36a-fe8fbd09c302', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', 'Drinks', 0, 'active', NOW(), NOW());
            

        INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, status, created_at, updated_at)
        VALUES ('05cfd5c0-64b0-4397-a207-4fc2d0029a32', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', 'Size', 'single', true, 1, 1, 'active', NOW(), NOW());
        

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('e4c188d3-e4a9-4d7f-ba5d-671d3f7e27f5', '05cfd5c0-64b0-4397-a207-4fc2d0029a32', 'Small', 0, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('33546ad4-23c9-47f9-8897-41b160810719', '05cfd5c0-64b0-4397-a207-4fc2d0029a32', 'Medium', 2, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('959e878f-158f-445c-a326-29c3778e1528', '05cfd5c0-64b0-4397-a207-4fc2d0029a32', 'Large', 5, 'active', NOW());
            

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2056e167-857a-4ff3-9098-6d73dc0127fa', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Spring Rolls', 'Delicious Spring Rolls prepared with fresh ingredients.', 19, 'available', false, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2056e167-857a-4ff3-9098-6d73dc0127fa', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1acb7231-2ae6-4a79-8de5-8250997f895d', '2056e167-857a-4ff3-9098-6d73dc0127fa', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2e39b3b5-8c0c-4685-b7d5-b569fb5ad761', '2056e167-857a-4ff3-9098-6d73dc0127fa', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c0df8b4f-f662-4c05-ac70-7708a5e0e677', '2056e167-857a-4ff3-9098-6d73dc0127fa', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('ecb1a981-a1ac-46f1-944a-415352c2a3dc', '2056e167-857a-4ff3-9098-6d73dc0127fa', 'https://placehold.co/600x400?text=Gusteau''s+Spring+Rolls', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('f413ee5c-4367-4532-b686-b0a3bdd20923', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Garlic Bread', 'Delicious Garlic Bread prepared with fresh ingredients.', 28, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('f413ee5c-4367-4532-b686-b0a3bdd20923', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5db0a658-2f94-4bce-af67-c9d745fe7fd6', 'f413ee5c-4367-4532-b686-b0a3bdd20923', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5be3db55-8467-4b19-9f09-c0c7e7d97e43', 'f413ee5c-4367-4532-b686-b0a3bdd20923', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1024244f-9984-4411-bd54-94da10eed319', 'f413ee5c-4367-4532-b686-b0a3bdd20923', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d3b3a388-229a-4df6-81b6-353c48dcd7a5', 'f413ee5c-4367-4532-b686-b0a3bdd20923', 'https://placehold.co/600x400?text=Gusteau''s+Garlic+Bread', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('5ca3ef44-c73b-41c1-938b-566423fca9ce', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Soup', 'Delicious Soup prepared with fresh ingredients.', 19, 'available', true, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('5ca3ef44-c73b-41c1-938b-566423fca9ce', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8269715c-cf2d-46ce-8436-17c011cc80d0', '5ca3ef44-c73b-41c1-938b-566423fca9ce', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b50a114c-36e3-4627-a74f-c29704a0ae9b', '5ca3ef44-c73b-41c1-938b-566423fca9ce', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('06ff95dc-b4d4-4585-ac59-94a2738f6c93', '5ca3ef44-c73b-41c1-938b-566423fca9ce', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('683600e9-625b-492b-a4a1-b91eb2e980c2', '5ca3ef44-c73b-41c1-938b-566423fca9ce', 'https://placehold.co/600x400?text=Gusteau''s+Soup', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('6d891fe2-ceeb-4594-adae-e84cecfe4eb8', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Salad', 'Delicious Salad prepared with fresh ingredients.', 6, 'available', false, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('6d891fe2-ceeb-4594-adae-e84cecfe4eb8', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('984e6991-529b-41b7-986d-8683711cefd5', '6d891fe2-ceeb-4594-adae-e84cecfe4eb8', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7e39121a-9a2f-43c5-9dc1-919608999838', '6d891fe2-ceeb-4594-adae-e84cecfe4eb8', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('27de719c-d8a1-4ee3-ad6b-295b7ecb3d89', '6d891fe2-ceeb-4594-adae-e84cecfe4eb8', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('25b90978-0e25-47b6-8962-2638bf0de220', '6d891fe2-ceeb-4594-adae-e84cecfe4eb8', 'https://placehold.co/600x400?text=Gusteau''s+Salad', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('342cc62c-d410-4427-8eb4-bf77a83f4cdd', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Wings', 'Delicious Wings prepared with fresh ingredients.', 5, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('342cc62c-d410-4427-8eb4-bf77a83f4cdd', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('02ac74e1-4ea7-456f-a36c-ed8d29585ba2', '342cc62c-d410-4427-8eb4-bf77a83f4cdd', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ab8ee543-a117-4149-88a9-df13d97ac586', '342cc62c-d410-4427-8eb4-bf77a83f4cdd', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9c261fa7-f766-4e12-8c61-dea7f648f857', '342cc62c-d410-4427-8eb4-bf77a83f4cdd', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('e6c14549-4be5-4f3f-bc98-4be07125c9e7', '342cc62c-d410-4427-8eb4-bf77a83f4cdd', 'https://placehold.co/600x400?text=Gusteau''s+Wings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d1678a57-cb09-4a22-bffb-6390952f2491', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Fries', 'Delicious Fries prepared with fresh ingredients.', 13, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d1678a57-cb09-4a22-bffb-6390952f2491', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f84481d7-7b99-454c-ab99-6cc3098c4a67', 'd1678a57-cb09-4a22-bffb-6390952f2491', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('38a90eb6-fe3e-4e1f-8447-b4f1966b618c', 'd1678a57-cb09-4a22-bffb-6390952f2491', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1e3b7a21-e05f-488b-a09e-0a7c8706bf83', 'd1678a57-cb09-4a22-bffb-6390952f2491', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('27b9936a-7818-47ee-9fa7-cd3d84eaf3c5', 'd1678a57-cb09-4a22-bffb-6390952f2491', 'https://placehold.co/600x400?text=Gusteau''s+Fries', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('0db1bfb4-dbeb-43dd-bb45-316d0224de73', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Nachos', 'Delicious Nachos prepared with fresh ingredients.', 6, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('0db1bfb4-dbeb-43dd-bb45-316d0224de73', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('84128a40-e171-4eba-bb6e-963946be1417', '0db1bfb4-dbeb-43dd-bb45-316d0224de73', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('46bc8601-b8d1-4fe8-adab-d2b515a7b470', '0db1bfb4-dbeb-43dd-bb45-316d0224de73', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e8d44e5c-b3b8-4cdb-8c68-a14c7bc5deae', '0db1bfb4-dbeb-43dd-bb45-316d0224de73', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('eb65f16f-a3ef-47f6-899f-7dcef07b765a', '0db1bfb4-dbeb-43dd-bb45-316d0224de73', 'https://placehold.co/600x400?text=Gusteau''s+Nachos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('a5a85075-bce8-415a-89bb-9f729eef8b88', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Calamari', 'Delicious Calamari prepared with fresh ingredients.', 14, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('a5a85075-bce8-415a-89bb-9f729eef8b88', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c48106c2-a5ab-4364-8fc9-830987e469fd', 'a5a85075-bce8-415a-89bb-9f729eef8b88', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4b5117b4-d17f-4ca4-89b2-9c85865b9e5d', 'a5a85075-bce8-415a-89bb-9f729eef8b88', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9ea70c92-dd91-463a-8c08-2a030a793d85', 'a5a85075-bce8-415a-89bb-9f729eef8b88', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('ace9d525-806b-4bdb-9746-c3af85306c63', 'a5a85075-bce8-415a-89bb-9f729eef8b88', 'https://placehold.co/600x400?text=Gusteau''s+Calamari', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('054ae7f3-2063-4752-8070-7ce2f6c4c61d', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Bruschetta', 'Delicious Bruschetta prepared with fresh ingredients.', 19, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('054ae7f3-2063-4752-8070-7ce2f6c4c61d', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('aabc6d4d-76db-4b5d-8931-234b06381edb', '054ae7f3-2063-4752-8070-7ce2f6c4c61d', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('14e5bf9d-1ab2-4545-a506-7240052d97bf', '054ae7f3-2063-4752-8070-7ce2f6c4c61d', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3a51a65e-4408-4b4f-9327-59ec735aafbe', '054ae7f3-2063-4752-8070-7ce2f6c4c61d', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('9c20f49f-023d-4e48-a6d6-89e13771be83', '054ae7f3-2063-4752-8070-7ce2f6c4c61d', 'https://placehold.co/600x400?text=Gusteau''s+Bruschetta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('47297cb2-9dea-494b-bc63-57ce31a22f67', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '33f47fc2-d7c4-4816-9fa9-eb1ba0f92523', 'Gusteau''s Dumplings', 'Delicious Dumplings prepared with fresh ingredients.', 24, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('47297cb2-9dea-494b-bc63-57ce31a22f67', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3c1669cf-134c-4c63-81c9-669f02546311', '47297cb2-9dea-494b-bc63-57ce31a22f67', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ee7b74de-9642-4af1-ac68-9431fe941333', '47297cb2-9dea-494b-bc63-57ce31a22f67', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6fdf6334-aece-4576-a11f-aa9db4a6a33c', '47297cb2-9dea-494b-bc63-57ce31a22f67', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('9ea4eda1-6439-4c5f-a69a-7e2960f1e01c', '47297cb2-9dea-494b-bc63-57ce31a22f67', 'https://placehold.co/600x400?text=Gusteau''s+Dumplings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7da97c52-4036-4494-8966-4cca74457783', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Steak', 'Delicious Steak prepared with fresh ingredients.', 7, 'available', false, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7da97c52-4036-4494-8966-4cca74457783', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('cb433e6e-7d06-48e3-a7e7-7708e7922f67', '7da97c52-4036-4494-8966-4cca74457783', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b62a1fdd-7e42-44a2-8bf4-6c8a4912b853', '7da97c52-4036-4494-8966-4cca74457783', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('423034fa-be24-4dee-9326-1b5a1299dfcc', '7da97c52-4036-4494-8966-4cca74457783', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('f9c5e6c6-83db-421e-96e1-a3de85696290', '7da97c52-4036-4494-8966-4cca74457783', 'https://placehold.co/600x400?text=Gusteau''s+Steak', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('f759b437-9297-4185-9b1a-0fc3e7d79841', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Pizza', 'Delicious Pizza prepared with fresh ingredients.', 20, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('f759b437-9297-4185-9b1a-0fc3e7d79841', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('93cda654-839e-41cc-9702-817c56512a8a', 'f759b437-9297-4185-9b1a-0fc3e7d79841', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5fe38183-e85e-4bbf-92c9-409497980f78', 'f759b437-9297-4185-9b1a-0fc3e7d79841', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7246dad2-ba6b-4914-a3a4-9178f59edf15', 'f759b437-9297-4185-9b1a-0fc3e7d79841', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('32a87e29-8d44-4b68-81ab-d02096a3d43c', 'f759b437-9297-4185-9b1a-0fc3e7d79841', 'https://placehold.co/600x400?text=Gusteau''s+Pizza', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('e7ad833d-921f-4f3b-8079-05a84c83a32b', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Burger', 'Delicious Burger prepared with fresh ingredients.', 5, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('e7ad833d-921f-4f3b-8079-05a84c83a32b', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0e29c684-7208-44c8-8060-3d4eaa5d1c37', 'e7ad833d-921f-4f3b-8079-05a84c83a32b', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2c817214-a469-405e-81b8-e1776748acf4', 'e7ad833d-921f-4f3b-8079-05a84c83a32b', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('553990b8-49d3-43ad-bb29-e48d3b7ff563', 'e7ad833d-921f-4f3b-8079-05a84c83a32b', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('84efa7ca-46de-4c1d-b048-0c64222c6bfd', 'e7ad833d-921f-4f3b-8079-05a84c83a32b', 'https://placehold.co/600x400?text=Gusteau''s+Burger', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('67a5259d-d3f5-4cb4-94ed-71bec0337f35', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Pasta', 'Delicious Pasta prepared with fresh ingredients.', 5, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('67a5259d-d3f5-4cb4-94ed-71bec0337f35', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e90c7ee0-b18b-4068-ac9c-e6810f5e08cb', '67a5259d-d3f5-4cb4-94ed-71bec0337f35', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0142314c-378e-4786-905a-271b0388bc0f', '67a5259d-d3f5-4cb4-94ed-71bec0337f35', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bbc3983b-06a3-4e18-806b-4f42b6b22854', '67a5259d-d3f5-4cb4-94ed-71bec0337f35', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c9ac8e02-6e7f-4700-bbff-20186ed723a0', '67a5259d-d3f5-4cb4-94ed-71bec0337f35', 'https://placehold.co/600x400?text=Gusteau''s+Pasta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('861194a7-444e-4717-a445-8fe143c67ea9', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Curry', 'Delicious Curry prepared with fresh ingredients.', 19, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('861194a7-444e-4717-a445-8fe143c67ea9', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e0066490-9d45-4347-a89f-9496d12fc50b', '861194a7-444e-4717-a445-8fe143c67ea9', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('49d76a71-2947-42d4-bbb4-50c3082f191b', '861194a7-444e-4717-a445-8fe143c67ea9', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f7c785c3-4992-49d6-8fc0-6af6a1ddeb5c', '861194a7-444e-4717-a445-8fe143c67ea9', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('471cca47-68f4-4702-b7f8-368185a931e7', '861194a7-444e-4717-a445-8fe143c67ea9', 'https://placehold.co/600x400?text=Gusteau''s+Curry', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('39f8f0d1-6bd8-495a-a3c5-913e5396cdf7', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Fish & Chips', 'Delicious Fish & Chips prepared with fresh ingredients.', 26, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('39f8f0d1-6bd8-495a-a3c5-913e5396cdf7', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fb25b796-1442-4d0d-b1f6-b243cf48a445', '39f8f0d1-6bd8-495a-a3c5-913e5396cdf7', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6926bb5b-6159-4d82-82ce-a9c221b95940', '39f8f0d1-6bd8-495a-a3c5-913e5396cdf7', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5180c886-dd7d-4e4a-a1be-12282b8532f5', '39f8f0d1-6bd8-495a-a3c5-913e5396cdf7', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('e7defe1e-ae77-4c40-8891-45659bc0fa3b', '39f8f0d1-6bd8-495a-a3c5-913e5396cdf7', 'https://placehold.co/600x400?text=Gusteau''s+Fish+&+Chips', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('5578cc7f-645c-4a65-99b1-d5ed2d444b1f', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Tacos', 'Delicious Tacos prepared with fresh ingredients.', 26, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('5578cc7f-645c-4a65-99b1-d5ed2d444b1f', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0c61dd3b-d668-4afd-b1f5-4e2d1ae3b6cf', '5578cc7f-645c-4a65-99b1-d5ed2d444b1f', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5c181c4c-68b6-4c33-8f53-74511c3a3a62', '5578cc7f-645c-4a65-99b1-d5ed2d444b1f', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('94f1aff5-f7d0-4cfd-8e4e-efb5d9c04134', '5578cc7f-645c-4a65-99b1-d5ed2d444b1f', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3f2c4998-5a69-4770-829d-5c34f2c52674', '5578cc7f-645c-4a65-99b1-d5ed2d444b1f', 'https://placehold.co/600x400?text=Gusteau''s+Tacos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('e17e016c-5baa-4637-9812-c015069cece6', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Lasagna', 'Delicious Lasagna prepared with fresh ingredients.', 15, 'available', false, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('e17e016c-5baa-4637-9812-c015069cece6', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('898ed094-b743-485f-b7cb-d07e636abd27', 'e17e016c-5baa-4637-9812-c015069cece6', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('303ec871-7f40-4b41-8c46-ebebfbf554f8', 'e17e016c-5baa-4637-9812-c015069cece6', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9f75d749-116f-442b-9bb7-1aefb80eb439', 'e17e016c-5baa-4637-9812-c015069cece6', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('2eb70351-65be-48ff-b5b7-47dcaf04da66', 'e17e016c-5baa-4637-9812-c015069cece6', 'https://placehold.co/600x400?text=Gusteau''s+Lasagna', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d7fc0eaf-a0e1-48e8-890c-878cb33fc35e', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Risotto', 'Delicious Risotto prepared with fresh ingredients.', 30, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d7fc0eaf-a0e1-48e8-890c-878cb33fc35e', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d6f95cbe-d343-4338-ba34-61ba585d1659', 'd7fc0eaf-a0e1-48e8-890c-878cb33fc35e', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('660a8e3d-2065-4921-8e16-4a12702ce689', 'd7fc0eaf-a0e1-48e8-890c-878cb33fc35e', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('566e91d6-df2a-43a7-af68-2292862bd65f', 'd7fc0eaf-a0e1-48e8-890c-878cb33fc35e', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('06270624-a2b8-43e7-8fd6-ddbb0c65f23f', 'd7fc0eaf-a0e1-48e8-890c-878cb33fc35e', 'https://placehold.co/600x400?text=Gusteau''s+Risotto', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('73a7d18a-1892-4b5a-aa51-745593cc715f', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '52da13fa-f9f6-4732-9e51-4239d140c939', 'Gusteau''s Sandwich', 'Delicious Sandwich prepared with fresh ingredients.', 21, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('73a7d18a-1892-4b5a-aa51-745593cc715f', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a2bd2e72-cbaf-41b6-9db6-0b3631d39c54', '73a7d18a-1892-4b5a-aa51-745593cc715f', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bbdf5402-e669-4df1-bf36-605273fa1227', '73a7d18a-1892-4b5a-aa51-745593cc715f', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a4da3729-59c0-42d9-b456-a9f770d56971', '73a7d18a-1892-4b5a-aa51-745593cc715f', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0a9493f1-8abd-40bd-a4e8-e57a9894fabf', '73a7d18a-1892-4b5a-aa51-745593cc715f', 'https://placehold.co/600x400?text=Gusteau''s+Sandwich', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('06922ae8-2ebd-4bea-b088-82192078c285', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Ice Cream', 'Delicious Ice Cream prepared with fresh ingredients.', 5, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('06922ae8-2ebd-4bea-b088-82192078c285', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f8fefe28-6daa-4ba4-86e6-7b68e54f00fe', '06922ae8-2ebd-4bea-b088-82192078c285', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1c0c3407-bdbb-4dd4-9521-ee529b45ba4d', '06922ae8-2ebd-4bea-b088-82192078c285', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('50e7ac59-32d5-42e1-8bae-598f861b56e7', '06922ae8-2ebd-4bea-b088-82192078c285', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('e572b401-8836-426c-987a-2a5523429697', '06922ae8-2ebd-4bea-b088-82192078c285', 'https://placehold.co/600x400?text=Gusteau''s+Ice+Cream', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('8256f643-7079-49f8-8448-76ba1168efcc', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Cake', 'Delicious Cake prepared with fresh ingredients.', 16, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('8256f643-7079-49f8-8448-76ba1168efcc', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b38ddb62-0984-4ef0-95cf-c9d76a83000c', '8256f643-7079-49f8-8448-76ba1168efcc', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('80b1837d-3135-403b-a18a-371a4d15df76', '8256f643-7079-49f8-8448-76ba1168efcc', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e84cae0a-f0ba-492c-adc8-6958af71c7b2', '8256f643-7079-49f8-8448-76ba1168efcc', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('a460322d-4c0b-444b-b6e9-cf4c5ec5d95e', '8256f643-7079-49f8-8448-76ba1168efcc', 'https://placehold.co/600x400?text=Gusteau''s+Cake', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('6097b84e-74af-4b52-8725-b4333384db77', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Pie', 'Delicious Pie prepared with fresh ingredients.', 23, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('6097b84e-74af-4b52-8725-b4333384db77', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0902a63b-bcdd-4f97-b56b-62bae5c36105', '6097b84e-74af-4b52-8725-b4333384db77', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f473b224-1631-473c-8f08-85728b22329e', '6097b84e-74af-4b52-8725-b4333384db77', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8aa1ec6f-95b4-4038-89e6-6b228860fca6', '6097b84e-74af-4b52-8725-b4333384db77', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('a3ac2a31-7888-4a2e-b3f2-10feb7cfa51d', '6097b84e-74af-4b52-8725-b4333384db77', 'https://placehold.co/600x400?text=Gusteau''s+Pie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('8f870386-9034-49ce-94d9-796fb392bb58', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Brownie', 'Delicious Brownie prepared with fresh ingredients.', 29, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('8f870386-9034-49ce-94d9-796fb392bb58', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dbf1ba80-ff21-40b3-aa4e-3a9c0d9e7826', '8f870386-9034-49ce-94d9-796fb392bb58', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f6b2b5af-6ce1-4cb1-8873-6be3b4646aa6', '8f870386-9034-49ce-94d9-796fb392bb58', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bd4a873a-a9c0-4389-98db-c1057262cc1f', '8f870386-9034-49ce-94d9-796fb392bb58', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c9ef488f-ca47-444d-a2f7-d9bafca2c027', '8f870386-9034-49ce-94d9-796fb392bb58', 'https://placehold.co/600x400?text=Gusteau''s+Brownie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('81680736-f200-46eb-a7d2-9addafef1a39', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Tiramisu', 'Delicious Tiramisu prepared with fresh ingredients.', 15, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('81680736-f200-46eb-a7d2-9addafef1a39', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('272158a4-a16e-4982-93d7-51d300fd6ac3', '81680736-f200-46eb-a7d2-9addafef1a39', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1766a14c-afcb-485f-80ca-69261dd09cf7', '81680736-f200-46eb-a7d2-9addafef1a39', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e7d681a1-be19-4675-9670-569705ee864a', '81680736-f200-46eb-a7d2-9addafef1a39', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3dfb3b01-3131-4610-bdb9-ef252690cb18', '81680736-f200-46eb-a7d2-9addafef1a39', 'https://placehold.co/600x400?text=Gusteau''s+Tiramisu', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('28bca4d4-0a9a-4ce2-90e3-d00941486677', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Pudding', 'Delicious Pudding prepared with fresh ingredients.', 14, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('28bca4d4-0a9a-4ce2-90e3-d00941486677', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0e108565-1907-4fb3-bbe9-b21762f85b11', '28bca4d4-0a9a-4ce2-90e3-d00941486677', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d0b6bafa-b1a5-4298-8b76-c2f112bddc55', '28bca4d4-0a9a-4ce2-90e3-d00941486677', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2a2683fc-d0fa-462e-90f9-983def27f718', '28bca4d4-0a9a-4ce2-90e3-d00941486677', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('4bc11e61-21bd-4f66-8dee-0ecb543874ba', '28bca4d4-0a9a-4ce2-90e3-d00941486677', 'https://placehold.co/600x400?text=Gusteau''s+Pudding', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('99f3ce13-f824-440a-b4dd-7a35b70e5325', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Tart', 'Delicious Tart prepared with fresh ingredients.', 25, 'available', false, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('99f3ce13-f824-440a-b4dd-7a35b70e5325', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4d1664c5-820c-48c9-9f2d-f7ce6a31ee9d', '99f3ce13-f824-440a-b4dd-7a35b70e5325', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('41fbdc58-cd66-4828-b1d2-660bf78a26cd', '99f3ce13-f824-440a-b4dd-7a35b70e5325', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ca4549ea-c731-4a1c-acd3-c61f80f03f2e', '99f3ce13-f824-440a-b4dd-7a35b70e5325', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('94c7d285-464e-4d52-9dfb-fcfb959a35f5', '99f3ce13-f824-440a-b4dd-7a35b70e5325', 'https://placehold.co/600x400?text=Gusteau''s+Tart', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('6da4ed13-7b35-450c-aa4d-e73da22e93a4', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Cookie', 'Delicious Cookie prepared with fresh ingredients.', 20, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('6da4ed13-7b35-450c-aa4d-e73da22e93a4', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('be831081-2701-45a3-a0de-d84ccb0beab6', '6da4ed13-7b35-450c-aa4d-e73da22e93a4', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a9ca0bb7-ebfe-4e94-9566-e44320326022', '6da4ed13-7b35-450c-aa4d-e73da22e93a4', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('59b4d976-d2e8-4a55-a3a8-650d88433a5e', '6da4ed13-7b35-450c-aa4d-e73da22e93a4', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('5e2c48e7-4426-4363-a994-2acb0a02dd21', '6da4ed13-7b35-450c-aa4d-e73da22e93a4', 'https://placehold.co/600x400?text=Gusteau''s+Cookie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('eedbbe81-1d99-4cbc-81b1-637422fd87cd', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Sorbet', 'Delicious Sorbet prepared with fresh ingredients.', 10, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('eedbbe81-1d99-4cbc-81b1-637422fd87cd', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('cd263261-bc90-4809-9856-0c4fecbaf4d5', 'eedbbe81-1d99-4cbc-81b1-637422fd87cd', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c926b089-f143-47ea-abcf-0ad51c15e456', 'eedbbe81-1d99-4cbc-81b1-637422fd87cd', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4f4fd557-8aac-45c9-af37-27f339bba42a', 'eedbbe81-1d99-4cbc-81b1-637422fd87cd', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6f3efb90-6534-4bfc-ba86-ef12df07449e', 'eedbbe81-1d99-4cbc-81b1-637422fd87cd', 'https://placehold.co/600x400?text=Gusteau''s+Sorbet', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('dac5420b-20c8-4ac5-ae92-32c11effff47', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '8e974697-03ea-492d-b08b-d8a42f9c8014', 'Gusteau''s Mousse', 'Delicious Mousse prepared with fresh ingredients.', 26, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('dac5420b-20c8-4ac5-ae92-32c11effff47', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('07c4dd96-34d7-4599-ab98-ba98288f016b', 'dac5420b-20c8-4ac5-ae92-32c11effff47', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('62fb2571-7dd1-4610-8c68-ddfe92a58144', 'dac5420b-20c8-4ac5-ae92-32c11effff47', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fc023e3d-58c8-4a43-9b46-2a56db1f37ba', 'dac5420b-20c8-4ac5-ae92-32c11effff47', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('40528887-e4be-4fd2-8da9-b30da5e4b75d', 'dac5420b-20c8-4ac5-ae92-32c11effff47', 'https://placehold.co/600x400?text=Gusteau''s+Mousse', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('046374a5-f034-4c72-a782-32cb76cb3ea1', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Coke', 'Delicious Coke prepared with fresh ingredients.', 9, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('046374a5-f034-4c72-a782-32cb76cb3ea1', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b86e1772-2796-42e4-887f-f07801311035', '046374a5-f034-4c72-a782-32cb76cb3ea1', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3985f066-c50d-4580-920b-1bac564029ca', '046374a5-f034-4c72-a782-32cb76cb3ea1', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('58063200-b391-4ab2-846a-d494802d18c6', '046374a5-f034-4c72-a782-32cb76cb3ea1', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d927fd9e-437c-41bd-b444-2f30ede36b92', '046374a5-f034-4c72-a782-32cb76cb3ea1', 'https://placehold.co/600x400?text=Gusteau''s+Coke', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('9d5f46ce-8af2-45b0-998f-b56ea3fe244d', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Water', 'Delicious Water prepared with fresh ingredients.', 11, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('9d5f46ce-8af2-45b0-998f-b56ea3fe244d', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6933604a-f3b0-408d-b4a0-18dc8f7672ed', '9d5f46ce-8af2-45b0-998f-b56ea3fe244d', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7f93c944-66a2-4f0d-b11b-c80626d6a251', '9d5f46ce-8af2-45b0-998f-b56ea3fe244d', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d598de71-19fc-4413-9dab-86b5efae2776', '9d5f46ce-8af2-45b0-998f-b56ea3fe244d', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3358b94c-ea43-4ca0-8bb9-b983643dab00', '9d5f46ce-8af2-45b0-998f-b56ea3fe244d', 'https://placehold.co/600x400?text=Gusteau''s+Water', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('03123ff6-eb69-4277-aa8e-d5f532c13809', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Juice', 'Delicious Juice prepared with fresh ingredients.', 27, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('03123ff6-eb69-4277-aa8e-d5f532c13809', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('090cbea0-910d-4f7f-af68-a0c4cb90b9d9', '03123ff6-eb69-4277-aa8e-d5f532c13809', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('993ea4c4-9187-4620-812b-5acbf25a97a9', '03123ff6-eb69-4277-aa8e-d5f532c13809', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4c1acc52-c75d-4d18-b071-fab1e2ed9744', '03123ff6-eb69-4277-aa8e-d5f532c13809', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c183f6eb-7772-4b21-b479-def432517e3e', '03123ff6-eb69-4277-aa8e-d5f532c13809', 'https://placehold.co/600x400?text=Gusteau''s+Juice', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('f102f087-7a9c-44a2-a90c-f139fb589e86', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Tea', 'Delicious Tea prepared with fresh ingredients.', 16, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('f102f087-7a9c-44a2-a90c-f139fb589e86', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6aea5d49-f815-496d-a6d4-ff81acf5b734', 'f102f087-7a9c-44a2-a90c-f139fb589e86', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6cdf0872-6fb5-44f5-96f5-39bd1f113858', 'f102f087-7a9c-44a2-a90c-f139fb589e86', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('776e57d0-f61e-40e4-9f9e-64ecb7dc6c26', 'f102f087-7a9c-44a2-a90c-f139fb589e86', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('cf2dd3f7-8964-4cf6-8dde-b08ab5f1641c', 'f102f087-7a9c-44a2-a90c-f139fb589e86', 'https://placehold.co/600x400?text=Gusteau''s+Tea', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('6731c91f-3565-481d-a959-21ee1591dc2a', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Coffee', 'Delicious Coffee prepared with fresh ingredients.', 8, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('6731c91f-3565-481d-a959-21ee1591dc2a', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b151de27-b9b6-4f55-9cfd-6ecc8fe977c4', '6731c91f-3565-481d-a959-21ee1591dc2a', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('121c99f5-b437-4621-aaef-3dc7052e0092', '6731c91f-3565-481d-a959-21ee1591dc2a', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('00f0e8db-0604-4360-81d0-6cae4be45489', '6731c91f-3565-481d-a959-21ee1591dc2a', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('e61edc5b-f13b-472f-a3eb-6c945e9059aa', '6731c91f-3565-481d-a959-21ee1591dc2a', 'https://placehold.co/600x400?text=Gusteau''s+Coffee', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('b70e23e5-b2bf-4f5a-9d71-07044a33d7e3', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Beer', 'Delicious Beer prepared with fresh ingredients.', 28, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('b70e23e5-b2bf-4f5a-9d71-07044a33d7e3', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('215c03fd-7284-4f96-aed5-d3326c8687b3', 'b70e23e5-b2bf-4f5a-9d71-07044a33d7e3', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ce324f23-8bff-49c0-8fff-ce265d550d31', 'b70e23e5-b2bf-4f5a-9d71-07044a33d7e3', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b44508f5-d0fb-4709-8e12-409721c05463', 'b70e23e5-b2bf-4f5a-9d71-07044a33d7e3', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('ffa644c5-367b-4a6c-b051-47c2b9035d8d', 'b70e23e5-b2bf-4f5a-9d71-07044a33d7e3', 'https://placehold.co/600x400?text=Gusteau''s+Beer', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('311e6970-b03e-43b6-ba69-5ab5d2d84f62', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Wine', 'Delicious Wine prepared with fresh ingredients.', 10, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('311e6970-b03e-43b6-ba69-5ab5d2d84f62', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f7f503c9-3c5d-4182-b507-24a2a1f300b2', '311e6970-b03e-43b6-ba69-5ab5d2d84f62', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('380b2436-d55c-4c0c-9d2f-b7fd67793354', '311e6970-b03e-43b6-ba69-5ab5d2d84f62', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6450a674-c8ab-4772-8174-a0694820bd18', '311e6970-b03e-43b6-ba69-5ab5d2d84f62', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('5eb07aa8-46d0-435c-b859-0148e7ebaf61', '311e6970-b03e-43b6-ba69-5ab5d2d84f62', 'https://placehold.co/600x400?text=Gusteau''s+Wine', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('18f7efd1-3cce-43f5-82d0-d42c58431097', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Soda', 'Delicious Soda prepared with fresh ingredients.', 13, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('18f7efd1-3cce-43f5-82d0-d42c58431097', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('96c9e1d9-4627-4fb4-9567-145de7166833', '18f7efd1-3cce-43f5-82d0-d42c58431097', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b8d25912-ca72-41a5-8754-671f7eda9c33', '18f7efd1-3cce-43f5-82d0-d42c58431097', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('32421c41-315b-4109-8d3e-8b0a7485ff68', '18f7efd1-3cce-43f5-82d0-d42c58431097', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0c1067bb-df68-443e-a079-d5e213c934c8', '18f7efd1-3cce-43f5-82d0-d42c58431097', 'https://placehold.co/600x400?text=Gusteau''s+Soda', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('1bef234e-6f8d-4416-bd18-0f77adfc346c', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Lemonade', 'Delicious Lemonade prepared with fresh ingredients.', 13, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('1bef234e-6f8d-4416-bd18-0f77adfc346c', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('27f7cfc9-71f8-4ce4-947e-ae6d2afa18a9', '1bef234e-6f8d-4416-bd18-0f77adfc346c', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9b11745b-f096-41b5-8527-f94fbf825aea', '1bef234e-6f8d-4416-bd18-0f77adfc346c', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f83f536f-2869-47ff-baf6-978dc3da7514', '1bef234e-6f8d-4416-bd18-0f77adfc346c', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6a501108-d700-43ae-a770-68422a9ee9fa', '1bef234e-6f8d-4416-bd18-0f77adfc346c', 'https://placehold.co/600x400?text=Gusteau''s+Lemonade', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('14a5960c-4eac-475c-b2c9-e31f04e66062', '89c2a5cf-eb82-4722-bdaa-58d2abf57a57', '73912d93-0154-4409-a36a-fe8fbd09c302', 'Gusteau''s Smoothie', 'Delicious Smoothie prepared with fresh ingredients.', 8, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('14a5960c-4eac-475c-b2c9-e31f04e66062', '05cfd5c0-64b0-4397-a207-4fc2d0029a32');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('10590197-e8ba-4dbe-8402-85144da55d0b', '14a5960c-4eac-475c-b2c9-e31f04e66062', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8a061ef0-75cb-4167-9a9f-22ef659a7351', '14a5960c-4eac-475c-b2c9-e31f04e66062', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c5eccc01-9bf2-4722-a177-7034f4988cf2', '14a5960c-4eac-475c-b2c9-e31f04e66062', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('da0bd7d2-a09d-46b2-8263-acd4fe2e878f', '14a5960c-4eac-475c-b2c9-e31f04e66062', 'https://placehold.co/600x400?text=Gusteau''s+Smoothie', true, NOW());
                

        INSERT INTO restaurants (id, name, address, owner_id, status, created_at, updated_at)
        VALUES ('d3ade154-caa2-4976-a4d3-d2f5071fac93', 'Pizza Planet', '123 Pizza Planet St.', 'ca9cd675-3ad8-4236-a54e-52b4d29814ba', 'active', NOW(), NOW());
        

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('8680901e-2ee6-469d-9804-2753d77dff90', 'T1', 2, 'Main Hall', 'active', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('52ba589f-f8d0-46ed-ae5f-acc2eea3f070', 'T2', 2, 'Main Hall', 'active', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('7c25fa1f-911b-41ef-8a17-dff8b63addb4', 'T3', 8, 'Main Hall', 'active', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('4a842e91-071e-4550-a9a1-bab0bc90e040', 'T4', 4, 'Main Hall', 'active', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('77d93aff-3b1e-4f21-8e9f-eceece0d50ef', 'T5', 4, 'Main Hall', 'active', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('5173fba7-34ea-4874-bda6-d5c10136790f', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', 'Appetizers', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('6509e381-b9d2-4b55-84f5-37738aa2c850', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', 'Main Course', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', 'Desserts', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('999b2e15-3b0f-474c-b657-dc166ab856e0', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', 'Drinks', 0, 'active', NOW(), NOW());
            

        INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, status, created_at, updated_at)
        VALUES ('31bc400d-f580-425a-891e-d2f85b1d9f73', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', 'Size', 'single', true, 1, 1, 'active', NOW(), NOW());
        

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('99aac06d-242e-4b4e-8ada-6433cb671643', '31bc400d-f580-425a-891e-d2f85b1d9f73', 'Small', 0, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('90ca004e-0039-4bad-8913-cb8d3997d741', '31bc400d-f580-425a-891e-d2f85b1d9f73', 'Medium', 2, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('8002c6e9-590b-4dd2-9cda-9ed417411fdd', '31bc400d-f580-425a-891e-d2f85b1d9f73', 'Large', 5, 'active', NOW());
            

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('b3942589-bc2b-47b7-925e-02f93e9d104a', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Spring Rolls', 'Delicious Spring Rolls prepared with fresh ingredients.', 7, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('b3942589-bc2b-47b7-925e-02f93e9d104a', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f5737450-d982-476a-a073-be11a877cdc6', 'b3942589-bc2b-47b7-925e-02f93e9d104a', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fd59a665-cbb1-459d-9754-bb24c07d2db4', 'b3942589-bc2b-47b7-925e-02f93e9d104a', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d23a1cd5-f6ae-4fde-a263-2f8fe4187093', 'b3942589-bc2b-47b7-925e-02f93e9d104a', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3703e66d-f11c-4ffb-b8ca-1943b045a8c8', 'b3942589-bc2b-47b7-925e-02f93e9d104a', 'https://placehold.co/600x400?text=Pizza+Planet+Spring+Rolls', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('e9fe715d-5ece-4728-aa3d-6a9076584ef5', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Garlic Bread', 'Delicious Garlic Bread prepared with fresh ingredients.', 6, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('e9fe715d-5ece-4728-aa3d-6a9076584ef5', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('135025d4-e870-4822-b8a5-9719cb85e8cd', 'e9fe715d-5ece-4728-aa3d-6a9076584ef5', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('52e08614-409e-4e3d-8a12-eb7c1ea05ab1', 'e9fe715d-5ece-4728-aa3d-6a9076584ef5', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0fcceb1d-d872-45f7-87f7-18dac9a8c60c', 'e9fe715d-5ece-4728-aa3d-6a9076584ef5', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('a68e6a08-9d91-4460-a824-caeeb1b4ba57', 'e9fe715d-5ece-4728-aa3d-6a9076584ef5', 'https://placehold.co/600x400?text=Pizza+Planet+Garlic+Bread', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('b1969dfc-a3ab-421a-8a7d-1c42e5f47028', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Soup', 'Delicious Soup prepared with fresh ingredients.', 11, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('b1969dfc-a3ab-421a-8a7d-1c42e5f47028', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('37eb2e36-582d-4783-abf1-f1656700dfe9', 'b1969dfc-a3ab-421a-8a7d-1c42e5f47028', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('acc91c36-3821-4eb4-aba8-91077ce2430b', 'b1969dfc-a3ab-421a-8a7d-1c42e5f47028', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('30b94dc4-93c2-47ca-ad29-08f587221483', 'b1969dfc-a3ab-421a-8a7d-1c42e5f47028', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('553dc1ce-34be-4a6c-b358-ff7bc99a7285', 'b1969dfc-a3ab-421a-8a7d-1c42e5f47028', 'https://placehold.co/600x400?text=Pizza+Planet+Soup', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2af6c022-70c0-41f2-8f82-1cbb07292134', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Salad', 'Delicious Salad prepared with fresh ingredients.', 12, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2af6c022-70c0-41f2-8f82-1cbb07292134', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('db7f489e-d4ef-4896-8a4f-b9814203d5e7', '2af6c022-70c0-41f2-8f82-1cbb07292134', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('77f7f3fd-2a00-4371-af11-fa0672fe6096', '2af6c022-70c0-41f2-8f82-1cbb07292134', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9c8ccd35-281a-407b-a59b-e51c6d5604b7', '2af6c022-70c0-41f2-8f82-1cbb07292134', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('7ad46676-21a5-4013-b31a-6426b9a9ada0', '2af6c022-70c0-41f2-8f82-1cbb07292134', 'https://placehold.co/600x400?text=Pizza+Planet+Salad', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('b19540a6-2b88-4be4-9ee7-b09402b8aeac', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Wings', 'Delicious Wings prepared with fresh ingredients.', 23, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('b19540a6-2b88-4be4-9ee7-b09402b8aeac', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2376fb49-c6cd-40df-99c9-2cb1afb73242', 'b19540a6-2b88-4be4-9ee7-b09402b8aeac', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ed6f88e4-ebf3-4d5f-bfef-da0034a29884', 'b19540a6-2b88-4be4-9ee7-b09402b8aeac', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5aca6ece-05cd-4378-a990-fb4944e18693', 'b19540a6-2b88-4be4-9ee7-b09402b8aeac', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d443ff43-b15b-4309-8896-d69c52eba78a', 'b19540a6-2b88-4be4-9ee7-b09402b8aeac', 'https://placehold.co/600x400?text=Pizza+Planet+Wings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('06b63095-3b0c-4347-be87-6e70787ac3cf', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Fries', 'Delicious Fries prepared with fresh ingredients.', 13, 'available', false, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('06b63095-3b0c-4347-be87-6e70787ac3cf', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e536870e-3f8f-465a-a853-feb3d34ae7d8', '06b63095-3b0c-4347-be87-6e70787ac3cf', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bd55ec34-05fe-4fba-8482-831d6a8d7bb7', '06b63095-3b0c-4347-be87-6e70787ac3cf', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5f969605-c338-4997-9c44-b78541f5ee34', '06b63095-3b0c-4347-be87-6e70787ac3cf', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('a45de5f9-03d7-4d23-b2ce-7bf722a39b1d', '06b63095-3b0c-4347-be87-6e70787ac3cf', 'https://placehold.co/600x400?text=Pizza+Planet+Fries', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('41e8e81b-f0eb-4ba4-b4c9-794b561bae7c', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Nachos', 'Delicious Nachos prepared with fresh ingredients.', 19, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('41e8e81b-f0eb-4ba4-b4c9-794b561bae7c', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dbcaebbc-3e5e-4135-ac15-6b9153df094d', '41e8e81b-f0eb-4ba4-b4c9-794b561bae7c', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7ebbb76c-7999-488f-849e-cba9dcc5eee7', '41e8e81b-f0eb-4ba4-b4c9-794b561bae7c', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1a122f6d-d81c-40ed-892e-1e39e3aca7ce', '41e8e81b-f0eb-4ba4-b4c9-794b561bae7c', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('24515b66-b5d3-417b-9ee4-0726d820f18d', '41e8e81b-f0eb-4ba4-b4c9-794b561bae7c', 'https://placehold.co/600x400?text=Pizza+Planet+Nachos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('f7eba408-1624-4541-a206-8d74a7e6bec2', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Calamari', 'Delicious Calamari prepared with fresh ingredients.', 30, 'available', true, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('f7eba408-1624-4541-a206-8d74a7e6bec2', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e03057c6-b7d8-45c2-a143-7def7e8ba5e0', 'f7eba408-1624-4541-a206-8d74a7e6bec2', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7282171d-f527-4d44-954f-52376954544e', 'f7eba408-1624-4541-a206-8d74a7e6bec2', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4f295ab0-bd79-4369-b1fa-34a7c966373a', 'f7eba408-1624-4541-a206-8d74a7e6bec2', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('f1201c63-1c8d-45bf-b79c-09698858824e', 'f7eba408-1624-4541-a206-8d74a7e6bec2', 'https://placehold.co/600x400?text=Pizza+Planet+Calamari', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('b61f3883-6477-4e8a-b335-a8929502e4d5', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Bruschetta', 'Delicious Bruschetta prepared with fresh ingredients.', 28, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('b61f3883-6477-4e8a-b335-a8929502e4d5', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b315841a-d75f-4813-b5ca-711ad6fc37c5', 'b61f3883-6477-4e8a-b335-a8929502e4d5', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c1569d15-3d86-46e9-9a87-b0c335e6b0fe', 'b61f3883-6477-4e8a-b335-a8929502e4d5', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e24b46c5-e623-4c6f-b092-98ae0a793449', 'b61f3883-6477-4e8a-b335-a8929502e4d5', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('9eee9012-4198-4831-af33-c271bf5a9ce6', 'b61f3883-6477-4e8a-b335-a8929502e4d5', 'https://placehold.co/600x400?text=Pizza+Planet+Bruschetta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('68494c94-b913-4d45-93e6-dc42ebcfa2c9', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '5173fba7-34ea-4874-bda6-d5c10136790f', 'Pizza Planet Dumplings', 'Delicious Dumplings prepared with fresh ingredients.', 5, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('68494c94-b913-4d45-93e6-dc42ebcfa2c9', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ce51d884-2b13-46b6-b003-674590dc3f24', '68494c94-b913-4d45-93e6-dc42ebcfa2c9', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b686ea9e-4bcf-45db-bd2f-7a5b0fce0719', '68494c94-b913-4d45-93e6-dc42ebcfa2c9', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0d67dfbe-b5a4-4e0b-b7db-5992c9f00d16', '68494c94-b913-4d45-93e6-dc42ebcfa2c9', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c6f6c0a6-19ab-44ed-a966-2c711df2a00b', '68494c94-b913-4d45-93e6-dc42ebcfa2c9', 'https://placehold.co/600x400?text=Pizza+Planet+Dumplings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('ce18462a-40fd-41b7-b7c7-a645f99ea820', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Steak', 'Delicious Steak prepared with fresh ingredients.', 8, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('ce18462a-40fd-41b7-b7c7-a645f99ea820', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b522877e-b1aa-4915-87f6-60de7d33fb6a', 'ce18462a-40fd-41b7-b7c7-a645f99ea820', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('81c9a252-128a-49ca-b3aa-e79a7a4482a1', 'ce18462a-40fd-41b7-b7c7-a645f99ea820', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('140d6d09-1a22-4e97-9e99-30cd3220d3bc', 'ce18462a-40fd-41b7-b7c7-a645f99ea820', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('7a534498-c0d1-4ab2-9a66-68d37b87cb01', 'ce18462a-40fd-41b7-b7c7-a645f99ea820', 'https://placehold.co/600x400?text=Pizza+Planet+Steak', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('6a79a06c-61b5-4bc7-85a0-69e3e63596bd', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Pizza', 'Delicious Pizza prepared with fresh ingredients.', 9, 'available', true, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('6a79a06c-61b5-4bc7-85a0-69e3e63596bd', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4b54d0b9-6758-46be-8c20-b37760061d34', '6a79a06c-61b5-4bc7-85a0-69e3e63596bd', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c0823367-1397-40fe-b42f-047210e6c02b', '6a79a06c-61b5-4bc7-85a0-69e3e63596bd', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0a234567-873f-4016-805e-a4f180f93514', '6a79a06c-61b5-4bc7-85a0-69e3e63596bd', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6b5bcde1-e866-46c6-ac76-eb73bb41b113', '6a79a06c-61b5-4bc7-85a0-69e3e63596bd', 'https://placehold.co/600x400?text=Pizza+Planet+Pizza', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('a0062ac6-2384-4ccd-beff-25fbae9e06e0', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Burger', 'Delicious Burger prepared with fresh ingredients.', 29, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('a0062ac6-2384-4ccd-beff-25fbae9e06e0', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6866dac1-fadb-44b0-a191-29ddbf5857a4', 'a0062ac6-2384-4ccd-beff-25fbae9e06e0', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('77a471c9-81fe-426e-9bed-4bf00bac617b', 'a0062ac6-2384-4ccd-beff-25fbae9e06e0', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('15ac3743-6740-4466-842c-0e0ac49c0850', 'a0062ac6-2384-4ccd-beff-25fbae9e06e0', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('fc176977-28b7-4950-9dda-ec201e6b9c2a', 'a0062ac6-2384-4ccd-beff-25fbae9e06e0', 'https://placehold.co/600x400?text=Pizza+Planet+Burger', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('1298eeaf-a203-41aa-8a8a-1d5f033009b5', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Pasta', 'Delicious Pasta prepared with fresh ingredients.', 19, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('1298eeaf-a203-41aa-8a8a-1d5f033009b5', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('10156a7d-9593-406e-9adb-f1c2eebb5138', '1298eeaf-a203-41aa-8a8a-1d5f033009b5', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ef28874f-c134-40e5-b714-ec8fbf927254', '1298eeaf-a203-41aa-8a8a-1d5f033009b5', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4ebee28d-48d4-4331-8d6b-e02c460b3e49', '1298eeaf-a203-41aa-8a8a-1d5f033009b5', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('316409ae-408a-46a6-afc6-5201f76f1358', '1298eeaf-a203-41aa-8a8a-1d5f033009b5', 'https://placehold.co/600x400?text=Pizza+Planet+Pasta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('14483023-6d55-45da-90af-658bf7a0bca5', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Curry', 'Delicious Curry prepared with fresh ingredients.', 25, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('14483023-6d55-45da-90af-658bf7a0bca5', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f25193d4-070d-419b-85a9-42dc004674b8', '14483023-6d55-45da-90af-658bf7a0bca5', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('25e70f58-1388-4239-ac4b-53193fc57c6e', '14483023-6d55-45da-90af-658bf7a0bca5', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1ad0996e-3c86-4a94-8c6a-b98c14bfed43', '14483023-6d55-45da-90af-658bf7a0bca5', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('bb9475d8-f1ea-4b8b-bf75-0f646b6dc40e', '14483023-6d55-45da-90af-658bf7a0bca5', 'https://placehold.co/600x400?text=Pizza+Planet+Curry', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('4ff46896-e906-43d7-8001-a0395a8f80cd', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Fish & Chips', 'Delicious Fish & Chips prepared with fresh ingredients.', 20, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('4ff46896-e906-43d7-8001-a0395a8f80cd', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a97e1c24-d420-4da7-b9fb-f97b0f59e06c', '4ff46896-e906-43d7-8001-a0395a8f80cd', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9de79fcf-4218-4821-96b8-218d4cd00da4', '4ff46896-e906-43d7-8001-a0395a8f80cd', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b187b4d3-32c0-4150-9272-45e51ed13fa6', '4ff46896-e906-43d7-8001-a0395a8f80cd', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('323d22be-b2d7-41b1-a09c-41c04302fef7', '4ff46896-e906-43d7-8001-a0395a8f80cd', 'https://placehold.co/600x400?text=Pizza+Planet+Fish+&+Chips', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('6554c91b-fafa-4c23-af21-7c6b4f53f940', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Tacos', 'Delicious Tacos prepared with fresh ingredients.', 22, 'available', false, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('6554c91b-fafa-4c23-af21-7c6b4f53f940', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('26eb0ebd-69c4-4689-9888-89105811bc0e', '6554c91b-fafa-4c23-af21-7c6b4f53f940', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('274a264f-cc2e-423c-aede-9cd00e57f155', '6554c91b-fafa-4c23-af21-7c6b4f53f940', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('575c6543-3d49-47d6-ad55-8b1ec8291b43', '6554c91b-fafa-4c23-af21-7c6b4f53f940', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('f65c2ba5-48c8-4fe0-b1a5-40a947f241ea', '6554c91b-fafa-4c23-af21-7c6b4f53f940', 'https://placehold.co/600x400?text=Pizza+Planet+Tacos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('8a3acdb5-8333-4050-86a9-b4f5eefa96e3', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Lasagna', 'Delicious Lasagna prepared with fresh ingredients.', 15, 'available', true, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('8a3acdb5-8333-4050-86a9-b4f5eefa96e3', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b05a958b-8c3e-4525-8b8b-7fa2aeff00ed', '8a3acdb5-8333-4050-86a9-b4f5eefa96e3', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0214ff51-55ca-41b7-8417-897f10094879', '8a3acdb5-8333-4050-86a9-b4f5eefa96e3', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4d1a7cf6-8028-4697-91ce-8589575a8be1', '8a3acdb5-8333-4050-86a9-b4f5eefa96e3', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0db66998-f6ca-462d-9de7-6a297391481b', '8a3acdb5-8333-4050-86a9-b4f5eefa96e3', 'https://placehold.co/600x400?text=Pizza+Planet+Lasagna', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('0fe11451-d959-4cb2-8bf7-71781326e3e4', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Risotto', 'Delicious Risotto prepared with fresh ingredients.', 16, 'available', false, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('0fe11451-d959-4cb2-8bf7-71781326e3e4', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8a2a2061-dcb6-490f-8366-a308959d9a22', '0fe11451-d959-4cb2-8bf7-71781326e3e4', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1713f686-6a96-4ce9-955b-bc9a36a2a957', '0fe11451-d959-4cb2-8bf7-71781326e3e4', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e89307c9-04c0-44fd-bc2f-ca6a7b6b3358', '0fe11451-d959-4cb2-8bf7-71781326e3e4', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('337e5e13-ecb4-4fcf-bb4a-a96200088218', '0fe11451-d959-4cb2-8bf7-71781326e3e4', 'https://placehold.co/600x400?text=Pizza+Planet+Risotto', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d976de4a-5799-47de-ab5a-3d3ab231c9bd', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '6509e381-b9d2-4b55-84f5-37738aa2c850', 'Pizza Planet Sandwich', 'Delicious Sandwich prepared with fresh ingredients.', 28, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d976de4a-5799-47de-ab5a-3d3ab231c9bd', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f7a184c8-1660-4c75-a5a9-2e850a8ef39f', 'd976de4a-5799-47de-ab5a-3d3ab231c9bd', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b65b81a5-1886-4894-9e7f-358e2d31a872', 'd976de4a-5799-47de-ab5a-3d3ab231c9bd', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6e4bb267-2333-4346-83be-aa0cb0588c15', 'd976de4a-5799-47de-ab5a-3d3ab231c9bd', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('18cd0380-0970-47f5-a4a9-651b52273a49', 'd976de4a-5799-47de-ab5a-3d3ab231c9bd', 'https://placehold.co/600x400?text=Pizza+Planet+Sandwich', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('e8108e5d-f775-4bfb-b530-401782d40ce6', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Ice Cream', 'Delicious Ice Cream prepared with fresh ingredients.', 28, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('e8108e5d-f775-4bfb-b530-401782d40ce6', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('28b2843a-55c2-4b5f-9466-94d512de27b2', 'e8108e5d-f775-4bfb-b530-401782d40ce6', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3afbc7d8-3e2c-4f30-982a-54c4a591cbca', 'e8108e5d-f775-4bfb-b530-401782d40ce6', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('64920387-48b1-447d-ad66-12eb867810c7', 'e8108e5d-f775-4bfb-b530-401782d40ce6', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('98be6cc9-a842-401b-a090-3d67e67ddde6', 'e8108e5d-f775-4bfb-b530-401782d40ce6', 'https://placehold.co/600x400?text=Pizza+Planet+Ice+Cream', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('5aca86bd-e512-4656-87f3-f73a4ec4faf0', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Cake', 'Delicious Cake prepared with fresh ingredients.', 25, 'available', false, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('5aca86bd-e512-4656-87f3-f73a4ec4faf0', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('738ec2a6-8d37-4eeb-b9be-316ebbf5f4fe', '5aca86bd-e512-4656-87f3-f73a4ec4faf0', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3793faec-34fb-45ea-85ea-af33eafe5167', '5aca86bd-e512-4656-87f3-f73a4ec4faf0', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a3924df0-b4e3-4ced-8dd7-ca0235e2da0b', '5aca86bd-e512-4656-87f3-f73a4ec4faf0', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('b084dade-0cfb-4daf-94ad-2a70abd866ca', '5aca86bd-e512-4656-87f3-f73a4ec4faf0', 'https://placehold.co/600x400?text=Pizza+Planet+Cake', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2e37dcd0-2c33-4126-812c-76fac2ab0c36', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Pie', 'Delicious Pie prepared with fresh ingredients.', 11, 'available', true, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2e37dcd0-2c33-4126-812c-76fac2ab0c36', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1f27731a-ad49-4874-bbc8-33e6e3b207f4', '2e37dcd0-2c33-4126-812c-76fac2ab0c36', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('909ad60a-2b67-41af-bd79-8c8c1eeab0e6', '2e37dcd0-2c33-4126-812c-76fac2ab0c36', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('db670bbd-8742-49e7-8f84-1ac93eae745f', '2e37dcd0-2c33-4126-812c-76fac2ab0c36', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('9fca78d9-e215-41e2-8b5a-212ba74f3c98', '2e37dcd0-2c33-4126-812c-76fac2ab0c36', 'https://placehold.co/600x400?text=Pizza+Planet+Pie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7686828b-9625-4f96-9580-718366569041', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Brownie', 'Delicious Brownie prepared with fresh ingredients.', 28, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7686828b-9625-4f96-9580-718366569041', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ab0623e9-ab55-4fa1-9c26-18778046fd65', '7686828b-9625-4f96-9580-718366569041', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5c7363e9-ef83-4186-8f13-882d528596da', '7686828b-9625-4f96-9580-718366569041', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e704daaa-09fd-4a6c-b49e-d2d5232bedcf', '7686828b-9625-4f96-9580-718366569041', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('ee9c6f0f-e2e9-4e52-a0cc-0f9814e5d616', '7686828b-9625-4f96-9580-718366569041', 'https://placehold.co/600x400?text=Pizza+Planet+Brownie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2b059c3b-6e41-4db5-ae7f-77349b4c8dc5', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Tiramisu', 'Delicious Tiramisu prepared with fresh ingredients.', 19, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2b059c3b-6e41-4db5-ae7f-77349b4c8dc5', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('05b5aaf3-e9d7-46d3-8db5-37a65fd1489b', '2b059c3b-6e41-4db5-ae7f-77349b4c8dc5', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('519a23f8-6570-4225-a258-eef60577a2c1', '2b059c3b-6e41-4db5-ae7f-77349b4c8dc5', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('06887d35-ad98-4373-a76c-0dca095c2244', '2b059c3b-6e41-4db5-ae7f-77349b4c8dc5', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0414ef7b-3694-4337-8bab-060d0eae6cbe', '2b059c3b-6e41-4db5-ae7f-77349b4c8dc5', 'https://placehold.co/600x400?text=Pizza+Planet+Tiramisu', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('6cd33011-761f-4cf9-b6fb-723cf5fabb7d', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Pudding', 'Delicious Pudding prepared with fresh ingredients.', 5, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('6cd33011-761f-4cf9-b6fb-723cf5fabb7d', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('18be7b6b-074c-46b9-9fb5-8dbe9a78a2da', '6cd33011-761f-4cf9-b6fb-723cf5fabb7d', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('72d5d6c4-cf7c-47b9-bd64-fea28b9bc0f1', '6cd33011-761f-4cf9-b6fb-723cf5fabb7d', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('64f81181-0bf7-4375-8435-681a80cf9e41', '6cd33011-761f-4cf9-b6fb-723cf5fabb7d', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('85cc2301-be3b-4355-a390-09defe9feb5a', '6cd33011-761f-4cf9-b6fb-723cf5fabb7d', 'https://placehold.co/600x400?text=Pizza+Planet+Pudding', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7520e284-2fb7-4ae6-9886-b27a48db03fd', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Tart', 'Delicious Tart prepared with fresh ingredients.', 19, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7520e284-2fb7-4ae6-9886-b27a48db03fd', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('920bf0ab-22d1-44da-ba2e-02f85fb8c118', '7520e284-2fb7-4ae6-9886-b27a48db03fd', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a2c8731f-11c6-462c-a8cb-ba77a6f8297b', '7520e284-2fb7-4ae6-9886-b27a48db03fd', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0bf4f932-b5a4-41a2-a506-7dc6878cd342', '7520e284-2fb7-4ae6-9886-b27a48db03fd', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('da5d315c-0ccd-4ff9-8f2b-966699b61720', '7520e284-2fb7-4ae6-9886-b27a48db03fd', 'https://placehold.co/600x400?text=Pizza+Planet+Tart', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('785a4983-d131-464e-b419-2d04a9bffec7', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Cookie', 'Delicious Cookie prepared with fresh ingredients.', 22, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('785a4983-d131-464e-b419-2d04a9bffec7', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2f9653cb-2a2b-4c67-91fa-e632df11735a', '785a4983-d131-464e-b419-2d04a9bffec7', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4f293c39-d906-45cd-a9b0-372436640adf', '785a4983-d131-464e-b419-2d04a9bffec7', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3db3f28d-06c4-4458-a507-0d07cc1ae94f', '785a4983-d131-464e-b419-2d04a9bffec7', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('eb187bf9-9669-4d9c-ac21-85fa50f4a40c', '785a4983-d131-464e-b419-2d04a9bffec7', 'https://placehold.co/600x400?text=Pizza+Planet+Cookie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('20b28068-3f66-40d7-a78b-74d47929155d', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Sorbet', 'Delicious Sorbet prepared with fresh ingredients.', 29, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('20b28068-3f66-40d7-a78b-74d47929155d', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('568f7e6b-d25a-493f-ad4b-deeaa087408a', '20b28068-3f66-40d7-a78b-74d47929155d', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b3af5f46-d2fc-4eca-a6c2-7200cb9c9624', '20b28068-3f66-40d7-a78b-74d47929155d', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3603a863-cd3f-47c6-aa13-63aa89ea977c', '20b28068-3f66-40d7-a78b-74d47929155d', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('02e3f316-b88a-466c-821b-111665d2cab4', '20b28068-3f66-40d7-a78b-74d47929155d', 'https://placehold.co/600x400?text=Pizza+Planet+Sorbet', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2a469a80-445e-489a-ba46-29ec0a555fe0', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '7b8fcfa3-fe48-4ec4-8697-b5f162b6356f', 'Pizza Planet Mousse', 'Delicious Mousse prepared with fresh ingredients.', 21, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2a469a80-445e-489a-ba46-29ec0a555fe0', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('803e926a-389f-4982-9cd8-f538bd1efafd', '2a469a80-445e-489a-ba46-29ec0a555fe0', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('70f2b690-9b95-4afe-863d-f85c177a5661', '2a469a80-445e-489a-ba46-29ec0a555fe0', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('34040511-f341-4f8e-b1da-303c78f896a6', '2a469a80-445e-489a-ba46-29ec0a555fe0', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('bc3ea345-54ec-4d8b-a37d-6849ece298d5', '2a469a80-445e-489a-ba46-29ec0a555fe0', 'https://placehold.co/600x400?text=Pizza+Planet+Mousse', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('b7eae5a2-244d-4df1-b655-d6cb3c12b482', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Coke', 'Delicious Coke prepared with fresh ingredients.', 18, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('b7eae5a2-244d-4df1-b655-d6cb3c12b482', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7d43cd6c-88c1-470a-86f4-d4ce4042ca3d', 'b7eae5a2-244d-4df1-b655-d6cb3c12b482', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f36121b0-5792-4939-ab80-5ed0842b6b50', 'b7eae5a2-244d-4df1-b655-d6cb3c12b482', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fddbe8b6-029b-4f4d-b01a-b86b576400f3', 'b7eae5a2-244d-4df1-b655-d6cb3c12b482', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('fc6ed2f0-0cdb-474a-b0c3-673caca04090', 'b7eae5a2-244d-4df1-b655-d6cb3c12b482', 'https://placehold.co/600x400?text=Pizza+Planet+Coke', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d20699b0-5bfd-4495-876e-a23104d5c3de', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Water', 'Delicious Water prepared with fresh ingredients.', 17, 'available', false, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d20699b0-5bfd-4495-876e-a23104d5c3de', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ba0dbd23-3318-4474-80f2-ae6321a56745', 'd20699b0-5bfd-4495-876e-a23104d5c3de', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('cc4ef05f-7219-472b-b844-af99092702de', 'd20699b0-5bfd-4495-876e-a23104d5c3de', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fd478fd2-0114-405d-ad59-f0a13fa88771', 'd20699b0-5bfd-4495-876e-a23104d5c3de', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('4f390ea4-5a34-4f36-ab1a-d5f3d44a111a', 'd20699b0-5bfd-4495-876e-a23104d5c3de', 'https://placehold.co/600x400?text=Pizza+Planet+Water', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('51ef17d1-a974-4e53-a400-1e792b193ecf', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Juice', 'Delicious Juice prepared with fresh ingredients.', 26, 'available', true, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('51ef17d1-a974-4e53-a400-1e792b193ecf', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c317a151-c5de-433d-9c04-c3168cb96042', '51ef17d1-a974-4e53-a400-1e792b193ecf', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1465d3d1-3e7e-474c-a636-6b4b47677b63', '51ef17d1-a974-4e53-a400-1e792b193ecf', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b855fc3a-44b6-416e-a697-cfc74b55282f', '51ef17d1-a974-4e53-a400-1e792b193ecf', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('8abc55dc-882b-4853-9e01-25c5321fbb4a', '51ef17d1-a974-4e53-a400-1e792b193ecf', 'https://placehold.co/600x400?text=Pizza+Planet+Juice', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('17f92d95-b09d-4153-8737-5138a5dd09c6', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Tea', 'Delicious Tea prepared with fresh ingredients.', 30, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('17f92d95-b09d-4153-8737-5138a5dd09c6', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7e058a26-c5de-4498-88e4-43955a5a75de', '17f92d95-b09d-4153-8737-5138a5dd09c6', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5858f824-129e-4313-91ed-a6c70b6bb631', '17f92d95-b09d-4153-8737-5138a5dd09c6', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('74c16adc-11c0-4453-a99d-6a29cee85bcb', '17f92d95-b09d-4153-8737-5138a5dd09c6', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('46468121-4605-4fa7-bc97-7d39be5967d3', '17f92d95-b09d-4153-8737-5138a5dd09c6', 'https://placehold.co/600x400?text=Pizza+Planet+Tea', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('a757ca94-5e46-464b-b030-a3b15d416681', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Coffee', 'Delicious Coffee prepared with fresh ingredients.', 5, 'available', false, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('a757ca94-5e46-464b-b030-a3b15d416681', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('97623034-7c1f-4076-9ef2-cfbb77784436', 'a757ca94-5e46-464b-b030-a3b15d416681', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d1aaead6-83f5-431c-bd76-3de51cd63365', 'a757ca94-5e46-464b-b030-a3b15d416681', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0cc365a4-37f0-404b-b18c-dfa0d0f5cedd', 'a757ca94-5e46-464b-b030-a3b15d416681', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('8b431ed6-02dd-48dd-90be-30bf21cfaebd', 'a757ca94-5e46-464b-b030-a3b15d416681', 'https://placehold.co/600x400?text=Pizza+Planet+Coffee', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('8db36d04-b244-4b3c-966a-e866f9fed75d', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Beer', 'Delicious Beer prepared with fresh ingredients.', 9, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('8db36d04-b244-4b3c-966a-e866f9fed75d', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b798da7f-9b5b-418c-91dc-41e6d9bf40c7', '8db36d04-b244-4b3c-966a-e866f9fed75d', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('58b3dbd4-5e9c-4d86-b338-70ba82625f9e', '8db36d04-b244-4b3c-966a-e866f9fed75d', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f70d05a9-3420-4576-9f6d-ea617ea223d3', '8db36d04-b244-4b3c-966a-e866f9fed75d', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('95df515f-ec99-40a1-a5ca-623f71032693', '8db36d04-b244-4b3c-966a-e866f9fed75d', 'https://placehold.co/600x400?text=Pizza+Planet+Beer', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('f270e097-95f2-4ef9-a185-349359cc56ab', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Wine', 'Delicious Wine prepared with fresh ingredients.', 6, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('f270e097-95f2-4ef9-a185-349359cc56ab', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('28bedf70-11a7-40b5-bca4-7ddb51f7c683', 'f270e097-95f2-4ef9-a185-349359cc56ab', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('eb0c93c3-c70a-4036-96d9-3beb3d87970d', 'f270e097-95f2-4ef9-a185-349359cc56ab', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9f6b95a1-c5ea-4a75-91ae-88408d4526fd', 'f270e097-95f2-4ef9-a185-349359cc56ab', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('b95d38c0-b1e4-46d1-9cc0-1f24f90ec447', 'f270e097-95f2-4ef9-a185-349359cc56ab', 'https://placehold.co/600x400?text=Pizza+Planet+Wine', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('e4d181f8-c335-47be-a301-2badd3720669', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Soda', 'Delicious Soda prepared with fresh ingredients.', 8, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('e4d181f8-c335-47be-a301-2badd3720669', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3964bdb3-f8cd-456d-a4a8-52008508bedc', 'e4d181f8-c335-47be-a301-2badd3720669', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e657ff7f-0362-42d9-be9a-0acf65161760', 'e4d181f8-c335-47be-a301-2badd3720669', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bb300e6b-d68d-4463-a3cd-773cb2295360', 'e4d181f8-c335-47be-a301-2badd3720669', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('a9b2e5fc-de2d-42a0-9587-5729bf876569', 'e4d181f8-c335-47be-a301-2badd3720669', 'https://placehold.co/600x400?text=Pizza+Planet+Soda', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('6391b414-18a0-4e33-8551-db5bda69bcc3', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Lemonade', 'Delicious Lemonade prepared with fresh ingredients.', 21, 'available', true, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('6391b414-18a0-4e33-8551-db5bda69bcc3', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e70e9144-cded-43ef-a30d-66919ff3a965', '6391b414-18a0-4e33-8551-db5bda69bcc3', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('04fdab59-d98b-4d29-9b09-5a485060f6f2', '6391b414-18a0-4e33-8551-db5bda69bcc3', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('44df97a1-a1a8-4587-9ae4-14dcbba02fbf', '6391b414-18a0-4e33-8551-db5bda69bcc3', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('5f2aedd8-de69-4290-affc-77688819e690', '6391b414-18a0-4e33-8551-db5bda69bcc3', 'https://placehold.co/600x400?text=Pizza+Planet+Lemonade', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('445beda0-fc41-42e7-baee-f2cd0e251dc0', 'd3ade154-caa2-4976-a4d3-d2f5071fac93', '999b2e15-3b0f-474c-b657-dc166ab856e0', 'Pizza Planet Smoothie', 'Delicious Smoothie prepared with fresh ingredients.', 16, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('445beda0-fc41-42e7-baee-f2cd0e251dc0', '31bc400d-f580-425a-891e-d2f85b1d9f73');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('40993c6c-7184-4077-99ab-48be6e3ff398', '445beda0-fc41-42e7-baee-f2cd0e251dc0', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('78c176b4-1cca-429c-ac03-9ffc78680430', '445beda0-fc41-42e7-baee-f2cd0e251dc0', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('72b80a33-5a8c-46d7-8d99-f02a672ec0bb', '445beda0-fc41-42e7-baee-f2cd0e251dc0', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('dd33b58b-c62a-431d-b96e-15afe8fc24ad', '445beda0-fc41-42e7-baee-f2cd0e251dc0', 'https://placehold.co/600x400?text=Pizza+Planet+Smoothie', true, NOW());
                

        INSERT INTO restaurants (id, name, address, owner_id, status, created_at, updated_at)
        VALUES ('b9ee72b5-3120-4520-b499-77ffda931a8a', 'Krusty Krab', '123 Krusty Krab St.', '8af26781-459a-4a30-8179-4fa011856da6', 'active', NOW(), NOW());
        

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('ca2da7c3-8cc2-4b47-aed6-1158821429ad', 'T1', 8, 'Main Hall', 'active', 'b9ee72b5-3120-4520-b499-77ffda931a8a', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('d99d558c-c013-4ce9-8bec-c7595c26f297', 'T2', 4, 'Main Hall', 'active', 'b9ee72b5-3120-4520-b499-77ffda931a8a', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('1045370f-e765-4110-945a-2dc2d388999a', 'T3', 2, 'Main Hall', 'active', 'b9ee72b5-3120-4520-b499-77ffda931a8a', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('955e0472-4da8-455c-8bc2-eaf38a52d520', 'T4', 8, 'Main Hall', 'active', 'b9ee72b5-3120-4520-b499-77ffda931a8a', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('7506388f-9839-4e86-b7bf-459d85a5b9a7', 'T5', 4, 'Main Hall', 'active', 'b9ee72b5-3120-4520-b499-77ffda931a8a', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'Appetizers', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('c5586dfa-e487-42b5-a762-b98bce53f7c6', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'Main Course', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'Desserts', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'Drinks', 0, 'active', NOW(), NOW());
            

        INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, status, created_at, updated_at)
        VALUES ('272c130e-b6f5-49fc-8454-cd4affbc2fa0', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'Size', 'single', true, 1, 1, 'active', NOW(), NOW());
        

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('52d0e09d-dc28-4278-8283-2e6832116329', '272c130e-b6f5-49fc-8454-cd4affbc2fa0', 'Small', 0, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('1b255db9-0d9f-4922-8a19-b61a8d2c238d', '272c130e-b6f5-49fc-8454-cd4affbc2fa0', 'Medium', 2, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('df288ad7-5f45-4b22-98fc-1d85f6fbd78f', '272c130e-b6f5-49fc-8454-cd4affbc2fa0', 'Large', 5, 'active', NOW());
            

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7082a917-a9b6-4649-a02c-c3c196886b17', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Spring Rolls', 'Delicious Spring Rolls prepared with fresh ingredients.', 15, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7082a917-a9b6-4649-a02c-c3c196886b17', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('032988ad-f0a6-4083-9c68-5fd444361e96', '7082a917-a9b6-4649-a02c-c3c196886b17', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('82d53619-1431-4cff-b9ac-5fbe842ab6e9', '7082a917-a9b6-4649-a02c-c3c196886b17', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('00a00b3d-eb3e-451d-8019-a5f513f5d572', '7082a917-a9b6-4649-a02c-c3c196886b17', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('b5744abf-6c6e-47a7-b25b-a3cd70a69a52', '7082a917-a9b6-4649-a02c-c3c196886b17', 'https://placehold.co/600x400?text=Krusty+Krab+Spring+Rolls', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('66f59b90-8131-4122-b889-47e46fb5333f', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Garlic Bread', 'Delicious Garlic Bread prepared with fresh ingredients.', 20, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('66f59b90-8131-4122-b889-47e46fb5333f', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('427e54bf-fd34-428c-9456-68a36fe2fcac', '66f59b90-8131-4122-b889-47e46fb5333f', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b5dce572-aec9-43ad-9b13-947a8326910c', '66f59b90-8131-4122-b889-47e46fb5333f', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('da18771c-1c0e-4f37-bb4c-9f10e16f72f6', '66f59b90-8131-4122-b889-47e46fb5333f', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('b9d91943-77cc-4bce-a0aa-e8b26d596d5d', '66f59b90-8131-4122-b889-47e46fb5333f', 'https://placehold.co/600x400?text=Krusty+Krab+Garlic+Bread', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d17a8bc9-0637-4c62-8fad-65681b0d306c', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Soup', 'Delicious Soup prepared with fresh ingredients.', 28, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d17a8bc9-0637-4c62-8fad-65681b0d306c', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f7e62505-883c-4252-87b4-44186d4f66c4', 'd17a8bc9-0637-4c62-8fad-65681b0d306c', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b91cbb7e-6531-4bcb-9df3-bf6313d52d37', 'd17a8bc9-0637-4c62-8fad-65681b0d306c', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0acba22d-4792-4dce-b4d7-aa7633e552e0', 'd17a8bc9-0637-4c62-8fad-65681b0d306c', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d4d80b17-d571-427b-a205-92fb432473b3', 'd17a8bc9-0637-4c62-8fad-65681b0d306c', 'https://placehold.co/600x400?text=Krusty+Krab+Soup', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('08e116e1-4760-468b-beb7-9d1cb87336a0', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Salad', 'Delicious Salad prepared with fresh ingredients.', 14, 'available', true, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('08e116e1-4760-468b-beb7-9d1cb87336a0', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('744c89ec-c849-4faa-95b5-2808f0f66305', '08e116e1-4760-468b-beb7-9d1cb87336a0', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('20591762-b787-4b41-852a-e4b586aff9f4', '08e116e1-4760-468b-beb7-9d1cb87336a0', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c2c9304d-e1af-41fa-9dba-4185978e4f28', '08e116e1-4760-468b-beb7-9d1cb87336a0', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('73999595-c28e-4f04-a142-9e3968115fa1', '08e116e1-4760-468b-beb7-9d1cb87336a0', 'https://placehold.co/600x400?text=Krusty+Krab+Salad', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('26a18e7d-1774-46f3-baba-fd8fd037e381', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Wings', 'Delicious Wings prepared with fresh ingredients.', 9, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('26a18e7d-1774-46f3-baba-fd8fd037e381', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('caf0c15e-b287-4a3c-8bfe-bfa410ea8d69', '26a18e7d-1774-46f3-baba-fd8fd037e381', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('59b46668-003a-4a2a-b30c-b3a3575c713e', '26a18e7d-1774-46f3-baba-fd8fd037e381', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4f40fa8a-db58-4f77-9a88-7fcfd6cddca1', '26a18e7d-1774-46f3-baba-fd8fd037e381', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('da9a4356-1bd3-4112-a629-7897ae978cf7', '26a18e7d-1774-46f3-baba-fd8fd037e381', 'https://placehold.co/600x400?text=Krusty+Krab+Wings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('51edb026-05f1-457e-824f-a573f7716f3d', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Fries', 'Delicious Fries prepared with fresh ingredients.', 5, 'available', true, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('51edb026-05f1-457e-824f-a573f7716f3d', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b51a25e7-5c38-4177-a5bd-756a29fac28e', '51edb026-05f1-457e-824f-a573f7716f3d', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2bf40995-d671-4ff6-9800-71feeb03ac97', '51edb026-05f1-457e-824f-a573f7716f3d', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9eaa99a2-0833-4598-affe-986d05cdf0f7', '51edb026-05f1-457e-824f-a573f7716f3d', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3ac8b58b-f1f9-41d9-af23-34c67d8cd030', '51edb026-05f1-457e-824f-a573f7716f3d', 'https://placehold.co/600x400?text=Krusty+Krab+Fries', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('35104fb8-a162-4233-9b5c-085f41cce7ef', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Nachos', 'Delicious Nachos prepared with fresh ingredients.', 22, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('35104fb8-a162-4233-9b5c-085f41cce7ef', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4a837b54-0b15-4dc1-89c2-9974cd2d3d65', '35104fb8-a162-4233-9b5c-085f41cce7ef', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('eb43d9f4-1fce-4b54-8645-31de1770aabb', '35104fb8-a162-4233-9b5c-085f41cce7ef', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ca5d93e9-5c9a-443e-91f9-2db1f5e03924', '35104fb8-a162-4233-9b5c-085f41cce7ef', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0a46218a-52f7-4f84-9386-5c181e120d5c', '35104fb8-a162-4233-9b5c-085f41cce7ef', 'https://placehold.co/600x400?text=Krusty+Krab+Nachos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('8f79e291-9f79-4e40-b594-d1340a28acb0', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Calamari', 'Delicious Calamari prepared with fresh ingredients.', 18, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('8f79e291-9f79-4e40-b594-d1340a28acb0', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('698b66a5-fe13-4b1c-85c5-437289a2ddba', '8f79e291-9f79-4e40-b594-d1340a28acb0', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('25187338-864c-4dc0-a3bf-9249ce063aa0', '8f79e291-9f79-4e40-b594-d1340a28acb0', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7ee03665-ad55-4a5c-9a23-1d5a56dbfbb8', '8f79e291-9f79-4e40-b594-d1340a28acb0', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('b27e53fe-a264-4f6d-8ab7-f78c2d505960', '8f79e291-9f79-4e40-b594-d1340a28acb0', 'https://placehold.co/600x400?text=Krusty+Krab+Calamari', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('c1750b23-609f-4132-9771-63a316b37f76', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Bruschetta', 'Delicious Bruschetta prepared with fresh ingredients.', 19, 'available', true, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('c1750b23-609f-4132-9771-63a316b37f76', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3573302c-ba8a-400f-84dc-0e115fc03c6c', 'c1750b23-609f-4132-9771-63a316b37f76', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d494d0e1-a561-4855-9863-c29d94984924', 'c1750b23-609f-4132-9771-63a316b37f76', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c3942326-0c51-442a-a704-ec3c3a44fbcd', 'c1750b23-609f-4132-9771-63a316b37f76', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('cbf6c572-b0e2-47ac-a8e9-89f837a957e9', 'c1750b23-609f-4132-9771-63a316b37f76', 'https://placehold.co/600x400?text=Krusty+Krab+Bruschetta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('4aabca6f-7d40-456d-b70d-2ca3bc53a6d3', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '59ecaf0a-e340-41fa-af95-d4a61e57f0f4', 'Krusty Krab Dumplings', 'Delicious Dumplings prepared with fresh ingredients.', 29, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('4aabca6f-7d40-456d-b70d-2ca3bc53a6d3', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0ae20a9f-7424-4135-9395-2029dfb6cf33', '4aabca6f-7d40-456d-b70d-2ca3bc53a6d3', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4cc94d30-b11a-428c-986a-e4885e4ae5e5', '4aabca6f-7d40-456d-b70d-2ca3bc53a6d3', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('39413b85-f2ac-4f66-814d-9459f2e71b6f', '4aabca6f-7d40-456d-b70d-2ca3bc53a6d3', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('e64cab20-8bc5-4475-ba5f-5d6636ffd883', '4aabca6f-7d40-456d-b70d-2ca3bc53a6d3', 'https://placehold.co/600x400?text=Krusty+Krab+Dumplings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7d0041af-84f8-40c6-8bdf-df4839509615', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Steak', 'Delicious Steak prepared with fresh ingredients.', 12, 'available', false, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7d0041af-84f8-40c6-8bdf-df4839509615', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f72129e3-db22-4cae-8f65-0d2109ce9384', '7d0041af-84f8-40c6-8bdf-df4839509615', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ebfd1dc0-ac30-4523-a15e-d5586323cc47', '7d0041af-84f8-40c6-8bdf-df4839509615', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('145a831d-6fd4-4d46-80ee-e0cf4c3b44b3', '7d0041af-84f8-40c6-8bdf-df4839509615', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('18326146-c2c6-45a0-88bc-56c08966c1b7', '7d0041af-84f8-40c6-8bdf-df4839509615', 'https://placehold.co/600x400?text=Krusty+Krab+Steak', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('06df5474-ac95-4017-8d1c-6cd31b2364ed', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Pizza', 'Delicious Pizza prepared with fresh ingredients.', 29, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('06df5474-ac95-4017-8d1c-6cd31b2364ed', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('97e761cd-b09d-4e27-ae98-8d67c5137bbd', '06df5474-ac95-4017-8d1c-6cd31b2364ed', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('989b2957-79a2-4c68-b7b0-175fa2dfb65d', '06df5474-ac95-4017-8d1c-6cd31b2364ed', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6c433625-9128-42e2-8496-67284e440c5a', '06df5474-ac95-4017-8d1c-6cd31b2364ed', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c80c2b55-b0db-4ab2-b9f4-71e201916277', '06df5474-ac95-4017-8d1c-6cd31b2364ed', 'https://placehold.co/600x400?text=Krusty+Krab+Pizza', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7677dbb3-0cee-4c4c-8aca-0e1276d23427', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Burger', 'Delicious Burger prepared with fresh ingredients.', 20, 'available', false, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7677dbb3-0cee-4c4c-8aca-0e1276d23427', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('da282ffa-e75f-489f-810f-90869524cde9', '7677dbb3-0cee-4c4c-8aca-0e1276d23427', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('182e5719-3d9d-4779-bf4d-fdf0560c361b', '7677dbb3-0cee-4c4c-8aca-0e1276d23427', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c82ca963-2f5b-4120-8f83-a9843bcb0bf0', '7677dbb3-0cee-4c4c-8aca-0e1276d23427', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c1952774-e79e-40ec-925e-c3e4c769b3ec', '7677dbb3-0cee-4c4c-8aca-0e1276d23427', 'https://placehold.co/600x400?text=Krusty+Krab+Burger', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('91a03eb7-76c7-4127-bb5a-f35e84c0c7cf', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Pasta', 'Delicious Pasta prepared with fresh ingredients.', 23, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('91a03eb7-76c7-4127-bb5a-f35e84c0c7cf', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('58c72225-1571-47d4-b01c-1436f1321d82', '91a03eb7-76c7-4127-bb5a-f35e84c0c7cf', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('87b4c3f0-dccc-4db8-950f-81936134a81b', '91a03eb7-76c7-4127-bb5a-f35e84c0c7cf', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('01f6d76c-3cc3-4d2d-b75d-468ebb280c63', '91a03eb7-76c7-4127-bb5a-f35e84c0c7cf', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('eb04d517-58f6-42b3-b70d-d447f9d2b8ff', '91a03eb7-76c7-4127-bb5a-f35e84c0c7cf', 'https://placehold.co/600x400?text=Krusty+Krab+Pasta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('c5b801d5-ada5-4dde-9c10-3e2063c44ff5', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Curry', 'Delicious Curry prepared with fresh ingredients.', 22, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('c5b801d5-ada5-4dde-9c10-3e2063c44ff5', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1f2f2970-7fbc-4e13-96c4-ce7e7a2133b6', 'c5b801d5-ada5-4dde-9c10-3e2063c44ff5', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('45259f13-95c1-44f9-90e6-9f1e3364b4a6', 'c5b801d5-ada5-4dde-9c10-3e2063c44ff5', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2ce6d0bf-c12f-42ed-ac0a-e44d1a73090f', 'c5b801d5-ada5-4dde-9c10-3e2063c44ff5', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d2f08540-b9e4-436c-b71d-5cb2c66365af', 'c5b801d5-ada5-4dde-9c10-3e2063c44ff5', 'https://placehold.co/600x400?text=Krusty+Krab+Curry', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('6f84d360-4d85-40ef-b04d-0ee056dbfec9', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Fish & Chips', 'Delicious Fish & Chips prepared with fresh ingredients.', 30, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('6f84d360-4d85-40ef-b04d-0ee056dbfec9', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ad3a256a-05f2-4385-8e8f-d25bea1e95d0', '6f84d360-4d85-40ef-b04d-0ee056dbfec9', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9984c71b-273b-4d81-9cfe-b726341dcecb', '6f84d360-4d85-40ef-b04d-0ee056dbfec9', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('91d4ca92-d7d7-4355-9696-9adcbc2170da', '6f84d360-4d85-40ef-b04d-0ee056dbfec9', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3f9768b3-efa9-4bff-a9dc-aa72127b7e11', '6f84d360-4d85-40ef-b04d-0ee056dbfec9', 'https://placehold.co/600x400?text=Krusty+Krab+Fish+&+Chips', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('732291cd-7a90-4835-b215-b8891da3de13', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Tacos', 'Delicious Tacos prepared with fresh ingredients.', 6, 'available', false, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('732291cd-7a90-4835-b215-b8891da3de13', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dd823a17-7fcc-418a-8f26-be96827d88ef', '732291cd-7a90-4835-b215-b8891da3de13', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9f17de2e-6d80-4485-9bed-40a9ae7008dd', '732291cd-7a90-4835-b215-b8891da3de13', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8e9d4899-5486-41ff-840f-b595a7ad6be3', '732291cd-7a90-4835-b215-b8891da3de13', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('1303ff45-38e4-404c-9f4c-c382de1859a8', '732291cd-7a90-4835-b215-b8891da3de13', 'https://placehold.co/600x400?text=Krusty+Krab+Tacos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('a243cf74-e02c-4b1d-93a2-6a9f29d08433', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Lasagna', 'Delicious Lasagna prepared with fresh ingredients.', 23, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('a243cf74-e02c-4b1d-93a2-6a9f29d08433', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('87344fb5-9d88-408f-af11-5470ccdd83b5', 'a243cf74-e02c-4b1d-93a2-6a9f29d08433', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b3eb7969-479c-486e-884e-cfda4de10430', 'a243cf74-e02c-4b1d-93a2-6a9f29d08433', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f20d1404-28f8-4942-bcb1-7f79b1ac1859', 'a243cf74-e02c-4b1d-93a2-6a9f29d08433', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('040051c4-3428-494b-8a26-f6ba9815432e', 'a243cf74-e02c-4b1d-93a2-6a9f29d08433', 'https://placehold.co/600x400?text=Krusty+Krab+Lasagna', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('4f7620f4-f512-48b6-9970-bab7a2132460', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Risotto', 'Delicious Risotto prepared with fresh ingredients.', 23, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('4f7620f4-f512-48b6-9970-bab7a2132460', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c9a2f7d2-fda7-4ec5-8c71-6587107f9ad5', '4f7620f4-f512-48b6-9970-bab7a2132460', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('254ac269-2a62-49a3-9042-ab2a65cc6190', '4f7620f4-f512-48b6-9970-bab7a2132460', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('212b0afb-c9f8-4d5f-9a06-1001bbef735f', '4f7620f4-f512-48b6-9970-bab7a2132460', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('874e2f98-290c-4c1d-9086-b74ba88b6329', '4f7620f4-f512-48b6-9970-bab7a2132460', 'https://placehold.co/600x400?text=Krusty+Krab+Risotto', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('e5811a37-106f-4232-9998-8a1c290d2d19', 'b9ee72b5-3120-4520-b499-77ffda931a8a', 'c5586dfa-e487-42b5-a762-b98bce53f7c6', 'Krusty Krab Sandwich', 'Delicious Sandwich prepared with fresh ingredients.', 5, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('e5811a37-106f-4232-9998-8a1c290d2d19', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f3a9ae80-bd5f-4255-8fe2-e3504cda038d', 'e5811a37-106f-4232-9998-8a1c290d2d19', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5bffe891-00f3-4507-bf68-69895c80ec61', 'e5811a37-106f-4232-9998-8a1c290d2d19', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0f82e23f-a14a-48be-82e7-d8054f8a9339', 'e5811a37-106f-4232-9998-8a1c290d2d19', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('4e6d0fcf-1d83-4d17-9548-ee4459c2c427', 'e5811a37-106f-4232-9998-8a1c290d2d19', 'https://placehold.co/600x400?text=Krusty+Krab+Sandwich', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('97108553-0734-4cff-8089-1c70e8649a0d', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Ice Cream', 'Delicious Ice Cream prepared with fresh ingredients.', 26, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('97108553-0734-4cff-8089-1c70e8649a0d', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f0b14f63-64d4-4262-8edc-91f68bc0a932', '97108553-0734-4cff-8089-1c70e8649a0d', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('56313580-941a-4314-a42a-cbccbeaa8bcc', '97108553-0734-4cff-8089-1c70e8649a0d', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('74f64320-a83b-410f-986e-6361e17d58ce', '97108553-0734-4cff-8089-1c70e8649a0d', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('bd49c9ee-3d70-4024-baa3-d5d5ff86ebdd', '97108553-0734-4cff-8089-1c70e8649a0d', 'https://placehold.co/600x400?text=Krusty+Krab+Ice+Cream', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('5aaee6e2-7bfc-49ee-afa1-185e5893cc32', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Cake', 'Delicious Cake prepared with fresh ingredients.', 15, 'available', true, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('5aaee6e2-7bfc-49ee-afa1-185e5893cc32', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('57a71948-581d-4e1a-9c2e-d6a74ae83859', '5aaee6e2-7bfc-49ee-afa1-185e5893cc32', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('392558b2-4b3f-4d3d-98c6-75a79862b306', '5aaee6e2-7bfc-49ee-afa1-185e5893cc32', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('08dfcbd2-69eb-4653-b605-038831ff83a2', '5aaee6e2-7bfc-49ee-afa1-185e5893cc32', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('4b3730f2-70d5-4344-8b9d-11d7d5bf96b4', '5aaee6e2-7bfc-49ee-afa1-185e5893cc32', 'https://placehold.co/600x400?text=Krusty+Krab+Cake', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('608c4358-5a8c-4d7c-99ae-3b88bdf68acd', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Pie', 'Delicious Pie prepared with fresh ingredients.', 27, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('608c4358-5a8c-4d7c-99ae-3b88bdf68acd', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4ebb217e-a9f4-48cf-9c76-1dcb8b7d848d', '608c4358-5a8c-4d7c-99ae-3b88bdf68acd', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1c54655c-1d3b-4eb7-8099-219bd33f08e8', '608c4358-5a8c-4d7c-99ae-3b88bdf68acd', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bcc08f84-0100-4b52-bc1a-3212ad3e6390', '608c4358-5a8c-4d7c-99ae-3b88bdf68acd', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('320a954d-e40b-4e34-aba2-49c13fe2ebcf', '608c4358-5a8c-4d7c-99ae-3b88bdf68acd', 'https://placehold.co/600x400?text=Krusty+Krab+Pie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('1bca1140-c5ba-4391-902f-3b6052d7a74c', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Brownie', 'Delicious Brownie prepared with fresh ingredients.', 23, 'available', true, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('1bca1140-c5ba-4391-902f-3b6052d7a74c', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e764306f-7ddc-4bf6-b1dc-cf6db2a82761', '1bca1140-c5ba-4391-902f-3b6052d7a74c', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('23f37f6c-714e-4937-958e-6e9fa1170b42', '1bca1140-c5ba-4391-902f-3b6052d7a74c', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('59375830-c76b-4629-8861-fff6f50879c7', '1bca1140-c5ba-4391-902f-3b6052d7a74c', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('22f4e529-ff2a-48cd-9bcf-e71fab3a5587', '1bca1140-c5ba-4391-902f-3b6052d7a74c', 'https://placehold.co/600x400?text=Krusty+Krab+Brownie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('e14ec1ac-148a-419c-9d1b-907c1a49ebd6', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Tiramisu', 'Delicious Tiramisu prepared with fresh ingredients.', 23, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('e14ec1ac-148a-419c-9d1b-907c1a49ebd6', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2a1b23c3-18c0-4c8c-a081-02f3879d771e', 'e14ec1ac-148a-419c-9d1b-907c1a49ebd6', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5443df62-0caa-48e2-9a7f-558dd2447dc1', 'e14ec1ac-148a-419c-9d1b-907c1a49ebd6', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ae2b628a-ce88-4e5a-a7da-868bb78cf448', 'e14ec1ac-148a-419c-9d1b-907c1a49ebd6', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d5605f6b-a173-4586-9775-3cc3b52875a8', 'e14ec1ac-148a-419c-9d1b-907c1a49ebd6', 'https://placehold.co/600x400?text=Krusty+Krab+Tiramisu', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('c3df6102-012a-4340-9f0a-b2eb69d48718', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Pudding', 'Delicious Pudding prepared with fresh ingredients.', 27, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('c3df6102-012a-4340-9f0a-b2eb69d48718', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e9dfbdbf-225c-4f8b-ac7f-f20f6ccb8a39', 'c3df6102-012a-4340-9f0a-b2eb69d48718', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('56ec7cc2-00a5-476c-b7d8-cbecd4d0c48c', 'c3df6102-012a-4340-9f0a-b2eb69d48718', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3596a3d2-7125-40ca-8968-525c8563505e', 'c3df6102-012a-4340-9f0a-b2eb69d48718', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3c178abb-d27b-41b0-9931-ebfc36a8448f', 'c3df6102-012a-4340-9f0a-b2eb69d48718', 'https://placehold.co/600x400?text=Krusty+Krab+Pudding', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('78b71001-056b-4969-b734-fe3ad4eb202e', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Tart', 'Delicious Tart prepared with fresh ingredients.', 20, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('78b71001-056b-4969-b734-fe3ad4eb202e', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d34c6c5f-a1b4-4e49-b6da-018850dfe90a', '78b71001-056b-4969-b734-fe3ad4eb202e', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1378b755-0301-47f0-a8a4-72065f79334c', '78b71001-056b-4969-b734-fe3ad4eb202e', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3ce92fcd-9571-47e8-a3c1-fdc209b9ca03', '78b71001-056b-4969-b734-fe3ad4eb202e', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3f2f9cc4-49df-4d46-8bf1-61047b05e1ef', '78b71001-056b-4969-b734-fe3ad4eb202e', 'https://placehold.co/600x400?text=Krusty+Krab+Tart', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7468bab2-a607-408d-99c5-6e8b6b9b9404', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Cookie', 'Delicious Cookie prepared with fresh ingredients.', 21, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7468bab2-a607-408d-99c5-6e8b6b9b9404', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bfa48ef5-e3bc-4c2b-8c5b-cd7e55237f73', '7468bab2-a607-408d-99c5-6e8b6b9b9404', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('251a04f5-f653-4600-8bf7-c968dfda81af', '7468bab2-a607-408d-99c5-6e8b6b9b9404', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('706d9b5e-83f2-4fe8-b6e4-db6fa1ee077c', '7468bab2-a607-408d-99c5-6e8b6b9b9404', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('8e7c8518-3438-4396-a88e-c503f72a297a', '7468bab2-a607-408d-99c5-6e8b6b9b9404', 'https://placehold.co/600x400?text=Krusty+Krab+Cookie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('92398f6b-e09d-4da8-8bc5-297b44cbcfb5', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Sorbet', 'Delicious Sorbet prepared with fresh ingredients.', 16, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('92398f6b-e09d-4da8-8bc5-297b44cbcfb5', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('af64102c-308b-4a60-bf81-2ebb87fb1b47', '92398f6b-e09d-4da8-8bc5-297b44cbcfb5', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0a882bc8-7375-4084-a9c1-4612bd2b789a', '92398f6b-e09d-4da8-8bc5-297b44cbcfb5', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('161283df-ecc9-4968-b801-29651f6aa9ba', '92398f6b-e09d-4da8-8bc5-297b44cbcfb5', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d1411a04-6367-478e-b31e-f0a87eea9875', '92398f6b-e09d-4da8-8bc5-297b44cbcfb5', 'https://placehold.co/600x400?text=Krusty+Krab+Sorbet', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('46b28f44-3734-4918-9c16-962aea227739', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '09d3f748-78b6-4bd5-9ae9-6f4fc54a0c22', 'Krusty Krab Mousse', 'Delicious Mousse prepared with fresh ingredients.', 12, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('46b28f44-3734-4918-9c16-962aea227739', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a8c7faf1-f734-47ae-875c-8c945095c32c', '46b28f44-3734-4918-9c16-962aea227739', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('620929ae-b331-4d03-abe3-f6e08fc58832', '46b28f44-3734-4918-9c16-962aea227739', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1bca2b00-103e-4972-9abe-54d15a505966', '46b28f44-3734-4918-9c16-962aea227739', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d36c941f-38e2-4a06-bc6e-ec3f33b2c79d', '46b28f44-3734-4918-9c16-962aea227739', 'https://placehold.co/600x400?text=Krusty+Krab+Mousse', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('26f318fa-b77f-45af-b13f-b85e335cb78d', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Coke', 'Delicious Coke prepared with fresh ingredients.', 18, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('26f318fa-b77f-45af-b13f-b85e335cb78d', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0205c150-2565-4bb5-9011-e9642198e487', '26f318fa-b77f-45af-b13f-b85e335cb78d', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dac5564f-16dd-48ca-81cf-a6be85009934', '26f318fa-b77f-45af-b13f-b85e335cb78d', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9ea122ea-378c-47e8-b2dc-71e0111b4188', '26f318fa-b77f-45af-b13f-b85e335cb78d', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d1b8addf-9dff-41ac-bb43-86a1fdc86b02', '26f318fa-b77f-45af-b13f-b85e335cb78d', 'https://placehold.co/600x400?text=Krusty+Krab+Coke', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('5e9f9e2b-1d5f-4421-9b28-ffc285054c68', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Water', 'Delicious Water prepared with fresh ingredients.', 15, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('5e9f9e2b-1d5f-4421-9b28-ffc285054c68', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f17e77e9-d07e-42c4-99c6-c746c7a09e26', '5e9f9e2b-1d5f-4421-9b28-ffc285054c68', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('084faa9c-fd7b-4199-8c41-66d9ea4c8180', '5e9f9e2b-1d5f-4421-9b28-ffc285054c68', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dd4ced6c-af99-424e-84df-7122cb65a54e', '5e9f9e2b-1d5f-4421-9b28-ffc285054c68', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0aa0fb45-53da-4e61-8e79-608399233e38', '5e9f9e2b-1d5f-4421-9b28-ffc285054c68', 'https://placehold.co/600x400?text=Krusty+Krab+Water', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('c2cafeaa-c79a-4932-bd77-4f7bda57f467', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Juice', 'Delicious Juice prepared with fresh ingredients.', 12, 'available', true, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('c2cafeaa-c79a-4932-bd77-4f7bda57f467', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3501a135-0375-4097-a2a2-afd93964d049', 'c2cafeaa-c79a-4932-bd77-4f7bda57f467', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7902787f-f856-4c6d-bc95-cf1776dc183f', 'c2cafeaa-c79a-4932-bd77-4f7bda57f467', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('98f87d7a-66f7-46f0-a3c8-489378f41dc8', 'c2cafeaa-c79a-4932-bd77-4f7bda57f467', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('ee1a4f64-2ad2-4fea-a0c3-13fa96e5b707', 'c2cafeaa-c79a-4932-bd77-4f7bda57f467', 'https://placehold.co/600x400?text=Krusty+Krab+Juice', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('805c34f1-f6f8-417b-b2a7-5ac76e417797', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Tea', 'Delicious Tea prepared with fresh ingredients.', 30, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('805c34f1-f6f8-417b-b2a7-5ac76e417797', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c28276f0-5167-42b8-ae3b-7214c15ec4d1', '805c34f1-f6f8-417b-b2a7-5ac76e417797', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3c69fcb1-fb3e-407b-bd39-fcf6c7cae4cf', '805c34f1-f6f8-417b-b2a7-5ac76e417797', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d36c0f9f-33d7-4e01-bc9f-f38ec6079839', '805c34f1-f6f8-417b-b2a7-5ac76e417797', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('98868521-9e02-481e-9f74-9bad631120e2', '805c34f1-f6f8-417b-b2a7-5ac76e417797', 'https://placehold.co/600x400?text=Krusty+Krab+Tea', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('8d32e30f-bae5-4618-b502-d6c72ef3cd31', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Coffee', 'Delicious Coffee prepared with fresh ingredients.', 25, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('8d32e30f-bae5-4618-b502-d6c72ef3cd31', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a31ca3a8-cb86-4ab5-97f5-3c8f319c7b79', '8d32e30f-bae5-4618-b502-d6c72ef3cd31', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('04ca228b-32bf-47f4-aaec-da9420ab8f5b', '8d32e30f-bae5-4618-b502-d6c72ef3cd31', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('038134a6-6493-4f37-8774-b5c87984b4b6', '8d32e30f-bae5-4618-b502-d6c72ef3cd31', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('5e4b8cdb-9533-4d88-b61b-69b97b9c525a', '8d32e30f-bae5-4618-b502-d6c72ef3cd31', 'https://placehold.co/600x400?text=Krusty+Krab+Coffee', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('f9436692-245a-4a6e-af07-785ac7c5479a', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Beer', 'Delicious Beer prepared with fresh ingredients.', 22, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('f9436692-245a-4a6e-af07-785ac7c5479a', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bfcf7a6a-70f0-4c85-9965-51568730f5e5', 'f9436692-245a-4a6e-af07-785ac7c5479a', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dd5933e1-b943-4f5b-87cd-ac8b46a28009', 'f9436692-245a-4a6e-af07-785ac7c5479a', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e099e4e5-4d10-4f76-9ebf-3c6e3ab97002', 'f9436692-245a-4a6e-af07-785ac7c5479a', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('b4c8bacb-bc92-4d9a-a8e5-220f594e8e85', 'f9436692-245a-4a6e-af07-785ac7c5479a', 'https://placehold.co/600x400?text=Krusty+Krab+Beer', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('484fa1b4-9b85-4424-bcce-a5159c640543', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Wine', 'Delicious Wine prepared with fresh ingredients.', 6, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('484fa1b4-9b85-4424-bcce-a5159c640543', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f3f62955-7749-4b2d-80b2-fca8074f37ed', '484fa1b4-9b85-4424-bcce-a5159c640543', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2e6b0452-28a0-4359-837f-15692c593f02', '484fa1b4-9b85-4424-bcce-a5159c640543', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5282ecd1-f1f5-461a-a6d8-8793d2e925e8', '484fa1b4-9b85-4424-bcce-a5159c640543', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('8ef9cd25-0273-4259-871c-431e75e464b1', '484fa1b4-9b85-4424-bcce-a5159c640543', 'https://placehold.co/600x400?text=Krusty+Krab+Wine', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('60a4295b-7157-43be-a893-311720eca29c', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Soda', 'Delicious Soda prepared with fresh ingredients.', 12, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('60a4295b-7157-43be-a893-311720eca29c', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('88e900d2-da39-4918-8bb6-2d44deb7e146', '60a4295b-7157-43be-a893-311720eca29c', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('31e56877-a827-4fe3-b878-a81445e3e8c9', '60a4295b-7157-43be-a893-311720eca29c', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0007e0e9-0b35-482f-9e98-bc281872e0b9', '60a4295b-7157-43be-a893-311720eca29c', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('fd46ab18-bf9f-40f4-a893-7c0fcbec810d', '60a4295b-7157-43be-a893-311720eca29c', 'https://placehold.co/600x400?text=Krusty+Krab+Soda', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('fd76221d-1d1f-42d8-a7a9-8b1c2c79450e', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Lemonade', 'Delicious Lemonade prepared with fresh ingredients.', 17, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('fd76221d-1d1f-42d8-a7a9-8b1c2c79450e', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('77ad757a-438b-466e-95a3-66330facaa29', 'fd76221d-1d1f-42d8-a7a9-8b1c2c79450e', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d1223c5e-fb02-4af0-99be-dfebe5153700', 'fd76221d-1d1f-42d8-a7a9-8b1c2c79450e', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e9b25eb3-5453-40ea-bccb-147da0cd4bff', 'fd76221d-1d1f-42d8-a7a9-8b1c2c79450e', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('f61df304-89cf-41c4-9b18-5cb3e6499238', 'fd76221d-1d1f-42d8-a7a9-8b1c2c79450e', 'https://placehold.co/600x400?text=Krusty+Krab+Lemonade', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d8b3d72b-7097-4b23-aa4a-c4b62715b47f', 'b9ee72b5-3120-4520-b499-77ffda931a8a', '7d5d6939-ff2d-4bf2-9192-d423be9db49c', 'Krusty Krab Smoothie', 'Delicious Smoothie prepared with fresh ingredients.', 17, 'available', false, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d8b3d72b-7097-4b23-aa4a-c4b62715b47f', '272c130e-b6f5-49fc-8454-cd4affbc2fa0');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('97c55559-e7bb-4d35-ae90-01b97a3f59ba', 'd8b3d72b-7097-4b23-aa4a-c4b62715b47f', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a5fd452b-8447-4466-9f2e-de4e11a10a7c', 'd8b3d72b-7097-4b23-aa4a-c4b62715b47f', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('82a8ac89-a168-4f0f-868a-0b40d126d7d1', 'd8b3d72b-7097-4b23-aa4a-c4b62715b47f', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('586e141a-0057-49d3-abb4-8b7800df3196', 'd8b3d72b-7097-4b23-aa4a-c4b62715b47f', 'https://placehold.co/600x400?text=Krusty+Krab+Smoothie', true, NOW());
                

        INSERT INTO restaurants (id, name, address, owner_id, status, created_at, updated_at)
        VALUES ('bdba2605-74c9-40d1-913e-45def9a3dd21', 'Los Pollos Hermanos', '123 Los Pollos Hermanos St.', '0049434d-6b20-48ec-a4cd-23dbbfb88d28', 'active', NOW(), NOW());
        

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('e93ebea5-5bd7-45d4-a7a9-d02b5c9e8971', 'T1', 8, 'Main Hall', 'active', 'bdba2605-74c9-40d1-913e-45def9a3dd21', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('ad865e95-c0f8-47c8-bc86-5716341572c9', 'T2', 2, 'Main Hall', 'active', 'bdba2605-74c9-40d1-913e-45def9a3dd21', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('9c540d89-bac2-4218-be98-6ad2b98bba99', 'T3', 2, 'Main Hall', 'active', 'bdba2605-74c9-40d1-913e-45def9a3dd21', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('144b538a-536c-4687-971d-31f0a3b74901', 'T4', 4, 'Main Hall', 'active', 'bdba2605-74c9-40d1-913e-45def9a3dd21', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('43b096e9-42ce-47ef-b7bc-f8cbfcd82a44', 'T5', 4, 'Main Hall', 'active', 'bdba2605-74c9-40d1-913e-45def9a3dd21', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'bdba2605-74c9-40d1-913e-45def9a3dd21', 'Appetizers', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('65e29830-d216-441c-b122-8123ca46e401', 'bdba2605-74c9-40d1-913e-45def9a3dd21', 'Main Course', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('0f352926-091e-438f-900f-9a05151d20e2', 'bdba2605-74c9-40d1-913e-45def9a3dd21', 'Desserts', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'bdba2605-74c9-40d1-913e-45def9a3dd21', 'Drinks', 0, 'active', NOW(), NOW());
            

        INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, status, created_at, updated_at)
        VALUES ('6e16c349-85a9-4c07-9656-3908735c3737', 'bdba2605-74c9-40d1-913e-45def9a3dd21', 'Size', 'single', true, 1, 1, 'active', NOW(), NOW());
        

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('7fe8479b-8cee-4979-977a-18c8636b5326', '6e16c349-85a9-4c07-9656-3908735c3737', 'Small', 0, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('aa18ca68-6db4-4611-9cba-42314cb62c7d', '6e16c349-85a9-4c07-9656-3908735c3737', 'Medium', 2, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('859edda4-b6f1-4e52-a8eb-8fd1b882e384', '6e16c349-85a9-4c07-9656-3908735c3737', 'Large', 5, 'active', NOW());
            

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('59c41a36-b450-462a-bb39-a5023710a073', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Spring Rolls', 'Delicious Spring Rolls prepared with fresh ingredients.', 5, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('59c41a36-b450-462a-bb39-a5023710a073', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f67279e3-4c76-49c8-97c4-7883e49138d6', '59c41a36-b450-462a-bb39-a5023710a073', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7512ed5b-7c0a-4e21-a579-61db10bf3196', '59c41a36-b450-462a-bb39-a5023710a073', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7206590c-84de-4a8a-a29a-455ef5d6df2f', '59c41a36-b450-462a-bb39-a5023710a073', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('772d8d20-deba-4c00-9712-796e1973cd9d', '59c41a36-b450-462a-bb39-a5023710a073', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Spring+Rolls', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('88b85b63-51b9-4798-860a-c3e4da7c26ba', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Garlic Bread', 'Delicious Garlic Bread prepared with fresh ingredients.', 28, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('88b85b63-51b9-4798-860a-c3e4da7c26ba', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1fbc9b41-a69a-4029-bcd0-5d298d9898ae', '88b85b63-51b9-4798-860a-c3e4da7c26ba', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8d369eb9-7f22-4b10-b7ae-b1d7079dbca6', '88b85b63-51b9-4798-860a-c3e4da7c26ba', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a6ca9896-de00-4db1-beb3-0ca56d46160b', '88b85b63-51b9-4798-860a-c3e4da7c26ba', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('2c62a135-21e8-4cae-931d-5cfa3fe3ce21', '88b85b63-51b9-4798-860a-c3e4da7c26ba', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Garlic+Bread', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('84b119f6-ed28-47fa-8179-ef3d1fe4f8f4', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Soup', 'Delicious Soup prepared with fresh ingredients.', 19, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('84b119f6-ed28-47fa-8179-ef3d1fe4f8f4', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('00f70f58-9686-41ae-ab4c-07a128a1b5fe', '84b119f6-ed28-47fa-8179-ef3d1fe4f8f4', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b112d8cb-8eb7-4e47-8265-6799b4cbd144', '84b119f6-ed28-47fa-8179-ef3d1fe4f8f4', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('29b1d34f-1713-4b64-a518-b680aec6fb5d', '84b119f6-ed28-47fa-8179-ef3d1fe4f8f4', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('416b75ab-024a-45fe-8b40-832b9e9d5c9b', '84b119f6-ed28-47fa-8179-ef3d1fe4f8f4', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Soup', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('fd47fb1f-1c30-4058-aabb-ab74378cb1b2', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Salad', 'Delicious Salad prepared with fresh ingredients.', 26, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('fd47fb1f-1c30-4058-aabb-ab74378cb1b2', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5ac69806-a05d-4660-81f2-184148348f3f', 'fd47fb1f-1c30-4058-aabb-ab74378cb1b2', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('90d758a3-05a5-4c95-b455-d96a732d2e75', 'fd47fb1f-1c30-4058-aabb-ab74378cb1b2', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('08fcb338-1aef-4943-944a-d7b82e07b669', 'fd47fb1f-1c30-4058-aabb-ab74378cb1b2', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0d2e6530-cb88-43ac-9b3c-ca3b113d8860', 'fd47fb1f-1c30-4058-aabb-ab74378cb1b2', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Salad', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2a06eb7a-bc83-4fd3-91d4-3a5138e37f76', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Wings', 'Delicious Wings prepared with fresh ingredients.', 19, 'available', true, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2a06eb7a-bc83-4fd3-91d4-3a5138e37f76', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7a6598b7-3a1a-461c-9330-74c734816232', '2a06eb7a-bc83-4fd3-91d4-3a5138e37f76', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e4fafdcf-9d2e-4c6f-886a-8d89733b81d6', '2a06eb7a-bc83-4fd3-91d4-3a5138e37f76', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('358c319b-93e1-49ed-9500-51d75392392b', '2a06eb7a-bc83-4fd3-91d4-3a5138e37f76', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3c282c3d-f43a-4cae-a6b4-6c8eb8764d30', '2a06eb7a-bc83-4fd3-91d4-3a5138e37f76', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Wings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('e0273dac-0192-4650-b24c-a30e698a17b8', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Fries', 'Delicious Fries prepared with fresh ingredients.', 18, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('e0273dac-0192-4650-b24c-a30e698a17b8', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4ed0bb52-aeb3-4697-9415-647ac2d79a16', 'e0273dac-0192-4650-b24c-a30e698a17b8', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0d505b56-745f-4d99-8e2e-5368d3fff4ea', 'e0273dac-0192-4650-b24c-a30e698a17b8', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b659d1d1-4e08-475d-8edc-bf6c25f42cb6', 'e0273dac-0192-4650-b24c-a30e698a17b8', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('9d0c2eaf-bc2c-4ec2-8404-b06ff4c22d3e', 'e0273dac-0192-4650-b24c-a30e698a17b8', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Fries', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('b3102bb5-92e0-40aa-a1c1-04c76434cd0c', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Nachos', 'Delicious Nachos prepared with fresh ingredients.', 25, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('b3102bb5-92e0-40aa-a1c1-04c76434cd0c', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('89abfa9f-55b1-4926-b6a7-80361723ddc1', 'b3102bb5-92e0-40aa-a1c1-04c76434cd0c', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('05b842c1-fe9c-413f-a70d-1e529fc03608', 'b3102bb5-92e0-40aa-a1c1-04c76434cd0c', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('06ed8089-a2c9-477d-b317-cc85576eacd0', 'b3102bb5-92e0-40aa-a1c1-04c76434cd0c', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0c91794d-d37f-4251-bb86-b69a875f5bd6', 'b3102bb5-92e0-40aa-a1c1-04c76434cd0c', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Nachos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('8b87d1ae-aa76-4da1-a67b-526fcf007760', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Calamari', 'Delicious Calamari prepared with fresh ingredients.', 13, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('8b87d1ae-aa76-4da1-a67b-526fcf007760', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('44caf1b0-0e5d-465a-9550-ea806ba9b14a', '8b87d1ae-aa76-4da1-a67b-526fcf007760', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6426b539-81a5-4591-87c3-3aa5092e9968', '8b87d1ae-aa76-4da1-a67b-526fcf007760', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1d66d6e2-3f43-48c2-8f72-4affbf89d645', '8b87d1ae-aa76-4da1-a67b-526fcf007760', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('1ba91cc3-0856-41e9-9558-2b1033b3a2b3', '8b87d1ae-aa76-4da1-a67b-526fcf007760', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Calamari', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('47ee6ad7-eed9-43b1-93eb-ba4eb7aa3847', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Bruschetta', 'Delicious Bruschetta prepared with fresh ingredients.', 23, 'available', true, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('47ee6ad7-eed9-43b1-93eb-ba4eb7aa3847', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f4b04353-8ac4-482a-870e-c8a3c328008e', '47ee6ad7-eed9-43b1-93eb-ba4eb7aa3847', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9d46d11d-0bff-49f3-aed3-3ef5694f68c6', '47ee6ad7-eed9-43b1-93eb-ba4eb7aa3847', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('549cec43-a411-449a-b125-b5bbba78162c', '47ee6ad7-eed9-43b1-93eb-ba4eb7aa3847', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0a08703f-f9e8-4a28-8b89-794b00aa2dd2', '47ee6ad7-eed9-43b1-93eb-ba4eb7aa3847', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Bruschetta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('34b8e037-98bd-4abc-aa4c-97a972013a49', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '004df5f3-889b-4ac1-a24c-4df9f04f0edc', 'Los Pollos Hermanos Dumplings', 'Delicious Dumplings prepared with fresh ingredients.', 8, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('34b8e037-98bd-4abc-aa4c-97a972013a49', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5d9bb6dd-91c5-4c07-9530-1c866edc2afa', '34b8e037-98bd-4abc-aa4c-97a972013a49', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('55493a94-54b7-424f-93f4-cf4d6382d60e', '34b8e037-98bd-4abc-aa4c-97a972013a49', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('980caba7-40b8-47b6-839e-24e4025df1a8', '34b8e037-98bd-4abc-aa4c-97a972013a49', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('97d02fcd-a9cb-4205-b0b6-1102d2117566', '34b8e037-98bd-4abc-aa4c-97a972013a49', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Dumplings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('1c31aca4-f64a-45f6-b708-e7765ebd92ce', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Steak', 'Delicious Steak prepared with fresh ingredients.', 22, 'available', true, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('1c31aca4-f64a-45f6-b708-e7765ebd92ce', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1335a6bf-16ca-4ce1-b574-280c1e596080', '1c31aca4-f64a-45f6-b708-e7765ebd92ce', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8091f000-e056-42a9-9f2d-da6d4ec5136d', '1c31aca4-f64a-45f6-b708-e7765ebd92ce', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7a4ff9d7-e3c2-4405-8ade-931e3737bdd7', '1c31aca4-f64a-45f6-b708-e7765ebd92ce', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('74c415bb-03bb-4da9-a967-db29ccc0d7e7', '1c31aca4-f64a-45f6-b708-e7765ebd92ce', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Steak', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('725b6dc6-c140-417e-8e6e-0efd4c6ecb71', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Pizza', 'Delicious Pizza prepared with fresh ingredients.', 25, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('725b6dc6-c140-417e-8e6e-0efd4c6ecb71', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b607613d-5e78-43bc-97c2-2af9ef30636e', '725b6dc6-c140-417e-8e6e-0efd4c6ecb71', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b15a876d-fe04-491c-bd22-0148b1feaaaa', '725b6dc6-c140-417e-8e6e-0efd4c6ecb71', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9b76e9c4-3deb-4df2-b538-a95518800341', '725b6dc6-c140-417e-8e6e-0efd4c6ecb71', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d01ecd51-36ac-467d-83a3-95238dffa50e', '725b6dc6-c140-417e-8e6e-0efd4c6ecb71', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Pizza', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('16aa0312-c96c-4da2-ad19-387765298662', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Burger', 'Delicious Burger prepared with fresh ingredients.', 17, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('16aa0312-c96c-4da2-ad19-387765298662', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3f1356a1-a19a-4474-a6ab-8065c1964db0', '16aa0312-c96c-4da2-ad19-387765298662', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ba94a789-9add-4f87-90ff-dfb4b96bffa5', '16aa0312-c96c-4da2-ad19-387765298662', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5d7f1f12-901f-4673-a82f-fff7866c0e1f', '16aa0312-c96c-4da2-ad19-387765298662', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('17fc1cb5-d07f-4a97-b582-2f24e9c0b7ac', '16aa0312-c96c-4da2-ad19-387765298662', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Burger', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2c59e437-2242-45f8-841d-18d11a108557', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Pasta', 'Delicious Pasta prepared with fresh ingredients.', 25, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2c59e437-2242-45f8-841d-18d11a108557', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a2cfa00b-f42c-4c3c-8f8d-926905342378', '2c59e437-2242-45f8-841d-18d11a108557', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1c9913eb-1389-4dda-8d1f-8bed04aa60df', '2c59e437-2242-45f8-841d-18d11a108557', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('03c4fabf-c471-460c-9f36-60bfaecf585a', '2c59e437-2242-45f8-841d-18d11a108557', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 4, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('996db617-e122-438b-8696-3c98e61ede60', '2c59e437-2242-45f8-841d-18d11a108557', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Pasta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('679065aa-2d0b-4f45-9491-ccc997c47986', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Curry', 'Delicious Curry prepared with fresh ingredients.', 26, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('679065aa-2d0b-4f45-9491-ccc997c47986', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('71a5be66-bbe8-47d6-a741-3353b5c4e1f0', '679065aa-2d0b-4f45-9491-ccc997c47986', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fff7d6cb-f51b-45df-8214-f845074ed64f', '679065aa-2d0b-4f45-9491-ccc997c47986', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dcff9ac7-1fdb-49b7-8d63-61b9dc17b070', '679065aa-2d0b-4f45-9491-ccc997c47986', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('5cf72d79-3ee9-4eae-8dbc-c41ee8e4cbbd', '679065aa-2d0b-4f45-9491-ccc997c47986', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Curry', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('8e80362b-5ef0-4f91-83b9-9918a6c125ed', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Fish & Chips', 'Delicious Fish & Chips prepared with fresh ingredients.', 14, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('8e80362b-5ef0-4f91-83b9-9918a6c125ed', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4647f3b5-7835-43f5-a6aa-3c30c87b6a03', '8e80362b-5ef0-4f91-83b9-9918a6c125ed', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9ac5e56d-7205-4007-8c06-d43152b4491d', '8e80362b-5ef0-4f91-83b9-9918a6c125ed', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8b433af5-5c98-4fbb-b19b-4799778187c1', '8e80362b-5ef0-4f91-83b9-9918a6c125ed', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('ef3be14f-a970-4495-8e4f-77df2f98a128', '8e80362b-5ef0-4f91-83b9-9918a6c125ed', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Fish+&+Chips', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('948908cf-5c3d-4373-8cd0-d4453cfedb7b', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Tacos', 'Delicious Tacos prepared with fresh ingredients.', 7, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('948908cf-5c3d-4373-8cd0-d4453cfedb7b', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('14a7b256-7287-4ce7-b587-c6e38cf70d75', '948908cf-5c3d-4373-8cd0-d4453cfedb7b', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1786b4a8-c9ae-4670-a4c2-641f2ca7a47a', '948908cf-5c3d-4373-8cd0-d4453cfedb7b', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5c97b743-574b-4c55-9432-138a51005067', '948908cf-5c3d-4373-8cd0-d4453cfedb7b', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('bba6d6ae-9ce0-4134-a72b-1b7fac19a331', '948908cf-5c3d-4373-8cd0-d4453cfedb7b', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Tacos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('ee999d14-fabb-4d49-89f8-9113cfe65a91', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Lasagna', 'Delicious Lasagna prepared with fresh ingredients.', 8, 'available', true, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('ee999d14-fabb-4d49-89f8-9113cfe65a91', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b3764e29-d153-47e9-a867-3f7bf7d02056', 'ee999d14-fabb-4d49-89f8-9113cfe65a91', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('60d0ebb4-c4a5-45cd-a49a-f9d4f0afd947', 'ee999d14-fabb-4d49-89f8-9113cfe65a91', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('28bea491-6b56-4c36-a170-d7530570e50e', 'ee999d14-fabb-4d49-89f8-9113cfe65a91', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('2f4dfa6a-933c-42e0-bd9c-e78060b2ccb5', 'ee999d14-fabb-4d49-89f8-9113cfe65a91', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Lasagna', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('475c7c09-22ae-4177-8cc8-d680ca4e74da', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Risotto', 'Delicious Risotto prepared with fresh ingredients.', 6, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('475c7c09-22ae-4177-8cc8-d680ca4e74da', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('86ee5492-4176-44a1-a192-36115fb4958c', '475c7c09-22ae-4177-8cc8-d680ca4e74da', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b3e8b067-efda-4628-8aee-15dea817500c', '475c7c09-22ae-4177-8cc8-d680ca4e74da', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d386c275-f29c-471f-83fb-b3889dc43256', '475c7c09-22ae-4177-8cc8-d680ca4e74da', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('5a27e046-acb7-4434-8603-76a4807c9e92', '475c7c09-22ae-4177-8cc8-d680ca4e74da', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Risotto', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2c2e5df3-0f0b-4c8e-9ef0-e67c973396f6', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '65e29830-d216-441c-b122-8123ca46e401', 'Los Pollos Hermanos Sandwich', 'Delicious Sandwich prepared with fresh ingredients.', 13, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2c2e5df3-0f0b-4c8e-9ef0-e67c973396f6', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('acaeac3f-f1ea-4cac-9c79-e64a17a9793d', '2c2e5df3-0f0b-4c8e-9ef0-e67c973396f6', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('92aaa55b-7d36-401b-a006-768a2cc48d0d', '2c2e5df3-0f0b-4c8e-9ef0-e67c973396f6', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c5fedf53-6f62-433c-b427-21a866781ead', '2c2e5df3-0f0b-4c8e-9ef0-e67c973396f6', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('a8747877-7dd2-4ee9-9457-5f12c4038908', '2c2e5df3-0f0b-4c8e-9ef0-e67c973396f6', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Sandwich', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('f1b3bdf3-5c92-4230-b396-90c8b5ebaf5c', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Ice Cream', 'Delicious Ice Cream prepared with fresh ingredients.', 15, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('f1b3bdf3-5c92-4230-b396-90c8b5ebaf5c', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4090e6f9-8cca-4c14-9433-96e01e88e314', 'f1b3bdf3-5c92-4230-b396-90c8b5ebaf5c', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e0029f76-fd35-4fc2-83b8-6d2404c6588d', 'f1b3bdf3-5c92-4230-b396-90c8b5ebaf5c', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a5a0705a-ce91-4824-8153-36d808f361c3', 'f1b3bdf3-5c92-4230-b396-90c8b5ebaf5c', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('5fa0aee1-86cb-4822-871f-36a65eff94e4', 'f1b3bdf3-5c92-4230-b396-90c8b5ebaf5c', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Ice+Cream', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d81271d4-1a9a-4e9e-baa0-26d4d7a1269d', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Cake', 'Delicious Cake prepared with fresh ingredients.', 27, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d81271d4-1a9a-4e9e-baa0-26d4d7a1269d', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('23bc29eb-80c5-4134-aa61-6123db273de3', 'd81271d4-1a9a-4e9e-baa0-26d4d7a1269d', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fa4dc495-55ea-4466-8389-73c10812962c', 'd81271d4-1a9a-4e9e-baa0-26d4d7a1269d', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('56d84fae-4b2f-484d-abc0-9605829e45a9', 'd81271d4-1a9a-4e9e-baa0-26d4d7a1269d', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('f0c78d1f-d967-4046-be5f-b24d50e3da78', 'd81271d4-1a9a-4e9e-baa0-26d4d7a1269d', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Cake', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('c1c9919e-ef90-4332-9ffa-26a557176847', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Pie', 'Delicious Pie prepared with fresh ingredients.', 7, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('c1c9919e-ef90-4332-9ffa-26a557176847', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('336fbf0c-5fa8-420a-97aa-733c64bb0c79', 'c1c9919e-ef90-4332-9ffa-26a557176847', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ed84606b-0da5-4b7d-abe9-4a98ab8a8260', 'c1c9919e-ef90-4332-9ffa-26a557176847', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4a1ee6ab-a39d-4718-94ad-544c5926651a', 'c1c9919e-ef90-4332-9ffa-26a557176847', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('cf2b1c9b-4667-41eb-9716-351146b4a060', 'c1c9919e-ef90-4332-9ffa-26a557176847', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Pie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('020cdb19-fdcf-4cfb-ab5a-cb8d5eb7d875', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Brownie', 'Delicious Brownie prepared with fresh ingredients.', 23, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('020cdb19-fdcf-4cfb-ab5a-cb8d5eb7d875', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f896531e-152b-477a-a315-7fb4a6ebaff2', '020cdb19-fdcf-4cfb-ab5a-cb8d5eb7d875', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('88bf538c-0156-44bc-b773-3cef7a475748', '020cdb19-fdcf-4cfb-ab5a-cb8d5eb7d875', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8e5aaabc-e391-4282-9574-db2bc2bf7df1', '020cdb19-fdcf-4cfb-ab5a-cb8d5eb7d875', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('1f16e974-29ab-4b00-aacb-abdfa56849e1', '020cdb19-fdcf-4cfb-ab5a-cb8d5eb7d875', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Brownie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('c4db2459-ce81-400f-8597-424c4f1dc370', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Tiramisu', 'Delicious Tiramisu prepared with fresh ingredients.', 30, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('c4db2459-ce81-400f-8597-424c4f1dc370', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('19723e55-4a18-4142-a72d-4539f0bd131c', 'c4db2459-ce81-400f-8597-424c4f1dc370', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5c942d65-5bca-4cf2-bcd2-d811f7c30970', 'c4db2459-ce81-400f-8597-424c4f1dc370', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('17d55f76-36a2-47f4-8b6f-bcbd2142ee4a', 'c4db2459-ce81-400f-8597-424c4f1dc370', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('99d211a9-4a42-4ba9-80d8-6622e437e26d', 'c4db2459-ce81-400f-8597-424c4f1dc370', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Tiramisu', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7f2d1f4b-fbb1-402c-a044-61459bd98151', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Pudding', 'Delicious Pudding prepared with fresh ingredients.', 29, 'available', true, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7f2d1f4b-fbb1-402c-a044-61459bd98151', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8395f5c7-5147-470c-8516-95442372c1b0', '7f2d1f4b-fbb1-402c-a044-61459bd98151', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ffd3c417-31ee-4e32-962e-d39aa7ee4fb1', '7f2d1f4b-fbb1-402c-a044-61459bd98151', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('65ed48bd-bf13-4961-b2f2-b11fddf177f8', '7f2d1f4b-fbb1-402c-a044-61459bd98151', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('852d36a0-db59-4075-942b-1bc08a372902', '7f2d1f4b-fbb1-402c-a044-61459bd98151', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Pudding', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('09d9c37f-512e-4a2e-b3b7-079e0b87bca1', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Tart', 'Delicious Tart prepared with fresh ingredients.', 9, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('09d9c37f-512e-4a2e-b3b7-079e0b87bca1', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('69a47fe8-4ea3-4923-81ef-c9cb732a427d', '09d9c37f-512e-4a2e-b3b7-079e0b87bca1', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('64f564af-7006-4226-8dd7-8045d2b5f0b5', '09d9c37f-512e-4a2e-b3b7-079e0b87bca1', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('21383784-635d-489e-892f-f2687b5866f0', '09d9c37f-512e-4a2e-b3b7-079e0b87bca1', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('94d2a5a4-65ce-477b-93a8-b6b72b2384d5', '09d9c37f-512e-4a2e-b3b7-079e0b87bca1', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Tart', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d20f5690-69f2-47d3-bf5d-23af5e1fd421', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Cookie', 'Delicious Cookie prepared with fresh ingredients.', 22, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d20f5690-69f2-47d3-bf5d-23af5e1fd421', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9d578233-4b42-46d8-8d52-cc27c61e5b49', 'd20f5690-69f2-47d3-bf5d-23af5e1fd421', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2416003c-6123-4f0c-a072-95a8603746e2', 'd20f5690-69f2-47d3-bf5d-23af5e1fd421', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7a37accc-6b8e-4266-8827-1f0a23c41902', 'd20f5690-69f2-47d3-bf5d-23af5e1fd421', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('4d6b3da8-72e9-434b-a7e5-28ca0663078a', 'd20f5690-69f2-47d3-bf5d-23af5e1fd421', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Cookie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('de982574-0938-4fa3-b86c-f9732b668b43', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Sorbet', 'Delicious Sorbet prepared with fresh ingredients.', 8, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('de982574-0938-4fa3-b86c-f9732b668b43', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c6031316-5d3e-4ab7-8fd0-331a01dbd143', 'de982574-0938-4fa3-b86c-f9732b668b43', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ebf3662c-99e0-4d1d-a4cd-df39f9443af5', 'de982574-0938-4fa3-b86c-f9732b668b43', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6fc32cef-5a18-4afc-b2bb-5b3c5c5bf589', 'de982574-0938-4fa3-b86c-f9732b668b43', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c96d4c3c-5927-40d6-9b60-bdae4b31151b', 'de982574-0938-4fa3-b86c-f9732b668b43', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Sorbet', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('59507d05-acb2-44d9-bf8b-9036d84eec72', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '0f352926-091e-438f-900f-9a05151d20e2', 'Los Pollos Hermanos Mousse', 'Delicious Mousse prepared with fresh ingredients.', 27, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('59507d05-acb2-44d9-bf8b-9036d84eec72', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d79de583-6afe-462e-8776-8adf5859e5cf', '59507d05-acb2-44d9-bf8b-9036d84eec72', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e34ea545-d7a7-4163-b440-d0acf1b8e311', '59507d05-acb2-44d9-bf8b-9036d84eec72', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bdecb9d6-8694-45ad-b459-fdfd38b04514', '59507d05-acb2-44d9-bf8b-9036d84eec72', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('e66bd416-0237-4566-bbb4-34d5361ed812', '59507d05-acb2-44d9-bf8b-9036d84eec72', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Mousse', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('35738f15-5fcc-40a2-9544-c2c5ee26c5d3', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Coke', 'Delicious Coke prepared with fresh ingredients.', 19, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('35738f15-5fcc-40a2-9544-c2c5ee26c5d3', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9600ff45-fc6d-4894-a186-9a35b23c3e59', '35738f15-5fcc-40a2-9544-c2c5ee26c5d3', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('51fc97fb-226b-4e87-943b-405684ab3c08', '35738f15-5fcc-40a2-9544-c2c5ee26c5d3', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ce27703b-40ad-42c4-a1d1-1de0abd36c5d', '35738f15-5fcc-40a2-9544-c2c5ee26c5d3', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('af3e3d94-ff24-49bb-b1fe-9c2df8c00ef4', '35738f15-5fcc-40a2-9544-c2c5ee26c5d3', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Coke', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('dcaa0b7e-8db9-49af-aa84-ddfeda789259', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Water', 'Delicious Water prepared with fresh ingredients.', 5, 'available', true, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('dcaa0b7e-8db9-49af-aa84-ddfeda789259', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8e02e14e-33b2-4997-b832-e78e81990b62', 'dcaa0b7e-8db9-49af-aa84-ddfeda789259', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e89d8cb3-f71d-4053-8483-39e90abb3ac7', 'dcaa0b7e-8db9-49af-aa84-ddfeda789259', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('903360da-f10a-47d0-8727-384f34680648', 'dcaa0b7e-8db9-49af-aa84-ddfeda789259', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c096eed8-a472-4fcf-b835-7fe679bce7ca', 'dcaa0b7e-8db9-49af-aa84-ddfeda789259', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Water', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d218fb5a-cec3-437b-9567-c0d9c7a09efa', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Juice', 'Delicious Juice prepared with fresh ingredients.', 15, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d218fb5a-cec3-437b-9567-c0d9c7a09efa', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('816873f6-3334-42c0-8aad-0bba8081f563', 'd218fb5a-cec3-437b-9567-c0d9c7a09efa', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1ffe02c2-782d-42e9-95cc-fbbe5294442b', 'd218fb5a-cec3-437b-9567-c0d9c7a09efa', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('994a67e0-0cef-4516-9145-b6abca3890e6', 'd218fb5a-cec3-437b-9567-c0d9c7a09efa', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('dccbf1d0-d307-49a2-801f-cdcb2407d4ac', 'd218fb5a-cec3-437b-9567-c0d9c7a09efa', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Juice', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('fe7bde68-debd-4c45-a943-064d1fbdc89e', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Tea', 'Delicious Tea prepared with fresh ingredients.', 13, 'available', false, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('fe7bde68-debd-4c45-a943-064d1fbdc89e', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b3944fb8-e508-4b87-b0dc-fad72211aa57', 'fe7bde68-debd-4c45-a943-064d1fbdc89e', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1d6cfd3f-12c5-4064-853e-bbf0168aeb77', 'fe7bde68-debd-4c45-a943-064d1fbdc89e', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('20c93b6a-3f53-48e9-bf03-724300fcd74f', 'fe7bde68-debd-4c45-a943-064d1fbdc89e', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0da8dc51-9fac-47b7-bf68-f13cc497cf92', 'fe7bde68-debd-4c45-a943-064d1fbdc89e', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Tea', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('42c6614f-adb7-43b2-826a-a00697d98887', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Coffee', 'Delicious Coffee prepared with fresh ingredients.', 7, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('42c6614f-adb7-43b2-826a-a00697d98887', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0f70ac58-5e79-4180-b4f8-a2ee49c0213a', '42c6614f-adb7-43b2-826a-a00697d98887', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('10117926-e64f-475e-a7dc-3548320f93d1', '42c6614f-adb7-43b2-826a-a00697d98887', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('56f17d63-4ba0-4cf8-b47d-9a3c179f5589', '42c6614f-adb7-43b2-826a-a00697d98887', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 4, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('098b341e-517a-4b79-8fae-fd0d310430cb', '42c6614f-adb7-43b2-826a-a00697d98887', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Coffee', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('854fed6a-aa95-4a99-8ede-2411c5655e24', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Beer', 'Delicious Beer prepared with fresh ingredients.', 7, 'available', false, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('854fed6a-aa95-4a99-8ede-2411c5655e24', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e9ac0e74-55cb-4400-a860-f96c6ea92562', '854fed6a-aa95-4a99-8ede-2411c5655e24', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c6916925-23c0-48a9-a7b1-63faeafa499e', '854fed6a-aa95-4a99-8ede-2411c5655e24', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8b24e013-6d00-49e3-9f5e-e3c72fc94981', '854fed6a-aa95-4a99-8ede-2411c5655e24', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('76c25611-4676-4583-b994-0ff8888b0bc7', '854fed6a-aa95-4a99-8ede-2411c5655e24', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Beer', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('075d3e64-661b-4a66-a9bc-c7a2d61c1186', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Wine', 'Delicious Wine prepared with fresh ingredients.', 9, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('075d3e64-661b-4a66-a9bc-c7a2d61c1186', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a77bda4a-c062-4a8b-b12c-12728b604134', '075d3e64-661b-4a66-a9bc-c7a2d61c1186', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0730030c-abd0-4a80-af9a-0a3faa3acdd2', '075d3e64-661b-4a66-a9bc-c7a2d61c1186', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7f92d87c-96c8-4ec0-aabd-ddfa97449341', '075d3e64-661b-4a66-a9bc-c7a2d61c1186', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('24280cac-4e45-4a42-92d7-f2292a5cf8b1', '075d3e64-661b-4a66-a9bc-c7a2d61c1186', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Wine', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('874d59d3-b6c2-4fda-8db0-73d34f55c66d', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Soda', 'Delicious Soda prepared with fresh ingredients.', 9, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('874d59d3-b6c2-4fda-8db0-73d34f55c66d', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a143bb5c-6513-472b-b7c0-a7406d40c275', '874d59d3-b6c2-4fda-8db0-73d34f55c66d', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('374513e4-aba5-41b7-9178-be63e370805f', '874d59d3-b6c2-4fda-8db0-73d34f55c66d', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6ec5d7c2-2e33-48e8-a088-7c23e68728fc', '874d59d3-b6c2-4fda-8db0-73d34f55c66d', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('74e2ba89-8323-4c03-b3b2-6cf617a618fe', '874d59d3-b6c2-4fda-8db0-73d34f55c66d', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Soda', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('44fd881d-0b7b-4ddb-b603-2935b3964c25', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Lemonade', 'Delicious Lemonade prepared with fresh ingredients.', 22, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('44fd881d-0b7b-4ddb-b603-2935b3964c25', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fdbf63dd-d2a8-4869-92da-346b636a158d', '44fd881d-0b7b-4ddb-b603-2935b3964c25', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('afd3b556-ce2d-4fef-aaf2-adfbf98c70de', '44fd881d-0b7b-4ddb-b603-2935b3964c25', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e667f41a-6036-46a9-ad80-8aa236f84f90', '44fd881d-0b7b-4ddb-b603-2935b3964c25', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('e43f9e6b-f19a-4325-a071-1d77a56b56c7', '44fd881d-0b7b-4ddb-b603-2935b3964c25', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Lemonade', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('63019ce1-c6f8-4ae8-a897-a0e7d73b446d', 'bdba2605-74c9-40d1-913e-45def9a3dd21', '4ccddaff-abd5-43b7-ace6-16d5fa2c8d04', 'Los Pollos Hermanos Smoothie', 'Delicious Smoothie prepared with fresh ingredients.', 6, 'available', true, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('63019ce1-c6f8-4ae8-a897-a0e7d73b446d', '6e16c349-85a9-4c07-9656-3908735c3737');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e7f52991-08e5-4cb8-a7ec-9abd1e184a1f', '63019ce1-c6f8-4ae8-a897-a0e7d73b446d', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('32b786a2-d11e-4014-886a-1ab15789646d', '63019ce1-c6f8-4ae8-a897-a0e7d73b446d', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7fd360b0-0bc2-4dc4-80de-a99659d4ec40', '63019ce1-c6f8-4ae8-a897-a0e7d73b446d', 'cfee657d-5498-4806-9e43-22f580596971', 3, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('db7441aa-32cc-4a87-b18d-98f1afd3f7a5', '63019ce1-c6f8-4ae8-a897-a0e7d73b446d', 'https://placehold.co/600x400?text=Los+Pollos+Hermanos+Smoothie', true, NOW());
                

        INSERT INTO restaurants (id, name, address, owner_id, status, created_at, updated_at)
        VALUES ('3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'Central Perk', '123 Central Perk St.', '858e6235-017d-4d3e-bf05-e771d74cbca7', 'active', NOW(), NOW());
        

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('ca6b1ef0-5e46-4a88-8c8c-896f19f0df13', 'T1', 2, 'Main Hall', 'active', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('a1756de7-2cdb-42e6-b402-e3105a7794a9', 'T2', 4, 'Main Hall', 'active', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('a669f8c4-ce66-4006-805b-696151c49d49', 'T3', 6, 'Main Hall', 'active', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('815ff195-f636-48b7-826e-791656fd4c1d', 'T4', 2, 'Main Hall', 'active', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', NOW(), NOW());
            

            INSERT INTO tables (id, table_number, capacity, location, status, restaurant_id, created_at, updated_at)
            VALUES ('feaa5d10-9a4f-4fc4-8f3c-09eb2ff30a76', 'T5', 8, 'Main Hall', 'active', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('3605edd5-aefa-4287-925b-a39f02cf0c98', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'Appetizers', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('707de6ee-e570-4df4-b62b-9addf4900e89', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'Main Course', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('08bdb6a9-6246-417c-9b9a-8abb29efe8e8', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'Desserts', 0, 'active', NOW(), NOW());
            

            INSERT INTO menu_categories (id, restaurant_id, name, display_order, status, created_at, updated_at)
            VALUES ('ec472eb3-a362-4d66-a84f-e845608f9694', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'Drinks', 0, 'active', NOW(), NOW());
            

        INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, status, created_at, updated_at)
        VALUES ('35bba00d-6d44-4cb3-a14b-16bc71a7b0da', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'Size', 'single', true, 1, 1, 'active', NOW(), NOW());
        

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('f3ca1c69-40e1-44a8-a5aa-284995586a97', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da', 'Small', 0, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('bb70e5cd-fe92-423c-af93-7411eacf4205', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da', 'Medium', 2, 'active', NOW());
            

            INSERT INTO modifier_options (id, group_id, name, price_adjustment, status, created_at)
            VALUES ('115c6279-658c-4fd1-b29e-094d9fe360bb', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da', 'Large', 5, 'active', NOW());
            

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('38f6580c-621a-48c3-8866-a37e4dc41f70', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Spring Rolls', 'Delicious Spring Rolls prepared with fresh ingredients.', 11, 'available', true, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('38f6580c-621a-48c3-8866-a37e4dc41f70', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a43a347b-9435-4650-9527-b0df2b86caad', '38f6580c-621a-48c3-8866-a37e4dc41f70', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ce9004b0-840d-4db9-8ebb-e20bfe02a22e', '38f6580c-621a-48c3-8866-a37e4dc41f70', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9f864e4c-6d6b-4eb4-9dd9-825980f6be2c', '38f6580c-621a-48c3-8866-a37e4dc41f70', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('edadaf0d-846d-4b94-80a5-340c6d82c35a', '38f6580c-621a-48c3-8866-a37e4dc41f70', 'https://placehold.co/600x400?text=Central+Perk+Spring+Rolls', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('0acc87ee-340d-4e7c-a9f3-73449fe63729', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Garlic Bread', 'Delicious Garlic Bread prepared with fresh ingredients.', 8, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('0acc87ee-340d-4e7c-a9f3-73449fe63729', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c7b0c26a-e850-4c2d-9533-7184fd5a6846', '0acc87ee-340d-4e7c-a9f3-73449fe63729', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a4461998-41ef-4add-9fd2-5be66288f02d', '0acc87ee-340d-4e7c-a9f3-73449fe63729', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('364a5bf6-93e8-42db-bf15-24e68def5890', '0acc87ee-340d-4e7c-a9f3-73449fe63729', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('de82ac62-c997-43c9-8fe7-cbe9230e06dc', '0acc87ee-340d-4e7c-a9f3-73449fe63729', 'https://placehold.co/600x400?text=Central+Perk+Garlic+Bread', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('b23f404a-5306-404d-94c0-00f4b5c7035d', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Soup', 'Delicious Soup prepared with fresh ingredients.', 29, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('b23f404a-5306-404d-94c0-00f4b5c7035d', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('668fade7-136a-4e60-bbf9-e9da566cc429', 'b23f404a-5306-404d-94c0-00f4b5c7035d', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0cacd5c3-9742-4c02-b4b2-282fcdcf5dd1', 'b23f404a-5306-404d-94c0-00f4b5c7035d', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('aa6b21d9-bb31-4cc6-8157-eb0446082ecd', 'b23f404a-5306-404d-94c0-00f4b5c7035d', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6088039f-cfef-46bd-8a5b-623dd5d7e49e', 'b23f404a-5306-404d-94c0-00f4b5c7035d', 'https://placehold.co/600x400?text=Central+Perk+Soup', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('60981c26-3fd6-46bd-91f3-7bebc273a216', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Salad', 'Delicious Salad prepared with fresh ingredients.', 24, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('60981c26-3fd6-46bd-91f3-7bebc273a216', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dd39d2ba-65ce-443c-ac5c-a21129cb3dc3', '60981c26-3fd6-46bd-91f3-7bebc273a216', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3073b218-fefc-4bf2-bd60-c3aa44f33048', '60981c26-3fd6-46bd-91f3-7bebc273a216', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6e73c817-a180-44b0-bb7f-b9ac73a78a52', '60981c26-3fd6-46bd-91f3-7bebc273a216', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('33867172-c2e9-4ab8-a630-f97069c937e7', '60981c26-3fd6-46bd-91f3-7bebc273a216', 'https://placehold.co/600x400?text=Central+Perk+Salad', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('9a7302ee-db5e-4764-bc78-9294ed1d6a4b', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Wings', 'Delicious Wings prepared with fresh ingredients.', 25, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('9a7302ee-db5e-4764-bc78-9294ed1d6a4b', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d005397d-96d4-44a4-9c71-2b0546495d8b', '9a7302ee-db5e-4764-bc78-9294ed1d6a4b', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('aa6f2b62-4061-442d-9e0a-575c4a4df713', '9a7302ee-db5e-4764-bc78-9294ed1d6a4b', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b2e77c8c-3d22-43f1-9210-984600da22f2', '9a7302ee-db5e-4764-bc78-9294ed1d6a4b', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('76d9d5f0-b415-4e09-97c5-13b990ac2803', '9a7302ee-db5e-4764-bc78-9294ed1d6a4b', 'https://placehold.co/600x400?text=Central+Perk+Wings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7e9455a7-22d9-4e98-9b4e-937d59c8f8e1', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Fries', 'Delicious Fries prepared with fresh ingredients.', 27, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7e9455a7-22d9-4e98-9b4e-937d59c8f8e1', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0dac526e-cdff-4cea-9354-21a6ae9b2a7b', '7e9455a7-22d9-4e98-9b4e-937d59c8f8e1', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c261b0b2-c3a0-4c9b-b52b-9b36448d40da', '7e9455a7-22d9-4e98-9b4e-937d59c8f8e1', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a47c36f1-e45a-416f-a928-afeea18cefc2', '7e9455a7-22d9-4e98-9b4e-937d59c8f8e1', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('5551ccae-6534-4524-8c92-de057c14fe9f', '7e9455a7-22d9-4e98-9b4e-937d59c8f8e1', 'https://placehold.co/600x400?text=Central+Perk+Fries', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('44c33bdd-3e3c-4cdc-b802-145895eb0e39', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Nachos', 'Delicious Nachos prepared with fresh ingredients.', 15, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('44c33bdd-3e3c-4cdc-b802-145895eb0e39', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dcb609c6-54da-42dc-aa1d-07c917a3675a', '44c33bdd-3e3c-4cdc-b802-145895eb0e39', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d5803111-0486-45c2-89f2-9b6fdbb0f409', '44c33bdd-3e3c-4cdc-b802-145895eb0e39', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f47e7693-8f1e-4bb5-9558-1ea63e4778b6', '44c33bdd-3e3c-4cdc-b802-145895eb0e39', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('e9f02ea7-f6da-44a2-8570-a69c905a7efb', '44c33bdd-3e3c-4cdc-b802-145895eb0e39', 'https://placehold.co/600x400?text=Central+Perk+Nachos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('ef023a03-2bbb-4cd1-a996-e0df02076f36', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Calamari', 'Delicious Calamari prepared with fresh ingredients.', 21, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('ef023a03-2bbb-4cd1-a996-e0df02076f36', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fd8f55ec-6001-4406-b403-70e82c5ffb13', 'ef023a03-2bbb-4cd1-a996-e0df02076f36', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('efabbb39-02ec-4065-b80c-6cb3fd4a8775', 'ef023a03-2bbb-4cd1-a996-e0df02076f36', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('09f70006-0f2a-4ad8-b6d3-c4cce8f7e58c', 'ef023a03-2bbb-4cd1-a996-e0df02076f36', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('74f1d9e0-1713-4bf1-bd5b-00420940759b', 'ef023a03-2bbb-4cd1-a996-e0df02076f36', 'https://placehold.co/600x400?text=Central+Perk+Calamari', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2f828295-8797-42d2-b08c-96e36d177d7c', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Bruschetta', 'Delicious Bruschetta prepared with fresh ingredients.', 30, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2f828295-8797-42d2-b08c-96e36d177d7c', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6da43f12-3a8b-4bd5-b398-75023e5399e4', '2f828295-8797-42d2-b08c-96e36d177d7c', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('131f807f-c850-4cbd-ba12-2abf0ecaaab2', '2f828295-8797-42d2-b08c-96e36d177d7c', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bc22baa0-8e9d-443e-a027-e4d21dd8d8a3', '2f828295-8797-42d2-b08c-96e36d177d7c', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('357aeb74-6976-4c57-a10a-ae761217f9ed', '2f828295-8797-42d2-b08c-96e36d177d7c', 'https://placehold.co/600x400?text=Central+Perk+Bruschetta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('1b12e55f-0a9f-466a-b11e-d029adbc1604', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '3605edd5-aefa-4287-925b-a39f02cf0c98', 'Central Perk Dumplings', 'Delicious Dumplings prepared with fresh ingredients.', 6, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('1b12e55f-0a9f-466a-b11e-d029adbc1604', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a7241809-92e1-4ab1-8a55-7384a61c2b3e', '1b12e55f-0a9f-466a-b11e-d029adbc1604', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7733b071-987e-4f0e-9742-9f654f3e79bd', '1b12e55f-0a9f-466a-b11e-d029adbc1604', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c414b038-e0d7-4638-98e4-05ef3fa66d91', '1b12e55f-0a9f-466a-b11e-d029adbc1604', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('17a77886-884c-442d-8166-db33e3991f25', '1b12e55f-0a9f-466a-b11e-d029adbc1604', 'https://placehold.co/600x400?text=Central+Perk+Dumplings', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2edb9021-9d5b-495c-b4fc-4369fcc830cf', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Steak', 'Delicious Steak prepared with fresh ingredients.', 30, 'available', false, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2edb9021-9d5b-495c-b4fc-4369fcc830cf', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5cd59942-d867-48be-afb0-7625659796e1', '2edb9021-9d5b-495c-b4fc-4369fcc830cf', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e3e6eb55-b242-48a1-8311-a339079eeb46', '2edb9021-9d5b-495c-b4fc-4369fcc830cf', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('387f52a8-d64f-48ba-9bf9-8754428d9843', '2edb9021-9d5b-495c-b4fc-4369fcc830cf', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('f4598779-5064-4f4a-a387-03efc3de80e3', '2edb9021-9d5b-495c-b4fc-4369fcc830cf', 'https://placehold.co/600x400?text=Central+Perk+Steak', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('29b25ab3-3064-4866-811b-ca5f342eff02', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Pizza', 'Delicious Pizza prepared with fresh ingredients.', 30, 'available', true, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('29b25ab3-3064-4866-811b-ca5f342eff02', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c3e4eab6-9634-4ecb-bee7-8a09bc0b9133', '29b25ab3-3064-4866-811b-ca5f342eff02', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d0c1efd6-ebb2-4ee3-a662-47cf52ab1abc', '29b25ab3-3064-4866-811b-ca5f342eff02', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c4aadb9e-28b1-4736-a367-dad3286ba51a', '29b25ab3-3064-4866-811b-ca5f342eff02', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('4be034d5-fc27-4334-ad08-9bf6d9a8fed9', '29b25ab3-3064-4866-811b-ca5f342eff02', 'https://placehold.co/600x400?text=Central+Perk+Pizza', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('a411963a-afcb-4ef1-a89a-73597516e0b9', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Burger', 'Delicious Burger prepared with fresh ingredients.', 17, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('a411963a-afcb-4ef1-a89a-73597516e0b9', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('be855306-5bdd-420e-9bfc-607fb3ae3223', 'a411963a-afcb-4ef1-a89a-73597516e0b9', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7ee1b117-7c35-4e4d-b826-8e096578388b', 'a411963a-afcb-4ef1-a89a-73597516e0b9', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d54ce52a-1a9d-4cd5-befe-c391d6038d2a', 'a411963a-afcb-4ef1-a89a-73597516e0b9', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d22469ae-a9c4-4dcf-b937-b3e35b2b93ba', 'a411963a-afcb-4ef1-a89a-73597516e0b9', 'https://placehold.co/600x400?text=Central+Perk+Burger', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('5ee1d08d-a852-4626-929b-61cd19ed5fe0', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Pasta', 'Delicious Pasta prepared with fresh ingredients.', 21, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('5ee1d08d-a852-4626-929b-61cd19ed5fe0', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8a4bc63e-b564-43ab-9df0-bf9e8f42e0a4', '5ee1d08d-a852-4626-929b-61cd19ed5fe0', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5b279034-a0fa-4df3-a3aa-e5722b37d128', '5ee1d08d-a852-4626-929b-61cd19ed5fe0', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d4b95544-3131-4d12-a4a2-3a8dda67f4c3', '5ee1d08d-a852-4626-929b-61cd19ed5fe0', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6c104b5c-31bb-41e2-9589-11c484d10cb4', '5ee1d08d-a852-4626-929b-61cd19ed5fe0', 'https://placehold.co/600x400?text=Central+Perk+Pasta', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('cbda7e49-ade6-4c03-859a-dc2a5f710107', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Curry', 'Delicious Curry prepared with fresh ingredients.', 18, 'available', true, 5.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('cbda7e49-ade6-4c03-859a-dc2a5f710107', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('97b0306f-decd-4223-b7af-b54dd8f500a6', 'cbda7e49-ade6-4c03-859a-dc2a5f710107', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e9b481d6-6721-4629-ae52-38af58e7258e', 'cbda7e49-ade6-4c03-859a-dc2a5f710107', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('36ebab4d-14cd-4f9e-9a45-2e6d932bd677', 'cbda7e49-ade6-4c03-859a-dc2a5f710107', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('1274a52a-1c45-4555-8092-921a866376fa', 'cbda7e49-ade6-4c03-859a-dc2a5f710107', 'https://placehold.co/600x400?text=Central+Perk+Curry', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('bc9159be-142f-417f-a45f-8d22f02739e5', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Fish & Chips', 'Delicious Fish & Chips prepared with fresh ingredients.', 8, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('bc9159be-142f-417f-a45f-8d22f02739e5', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('4349f3f9-2be1-4e96-b4c4-809d3310b3b8', 'bc9159be-142f-417f-a45f-8d22f02739e5', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6f18c442-ce5b-4a71-a639-ed195d46727e', 'bc9159be-142f-417f-a45f-8d22f02739e5', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d3c4f703-4c90-4bc3-b6d6-ab3d1706deb4', 'bc9159be-142f-417f-a45f-8d22f02739e5', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('4f233521-b251-4772-9e02-944f059b49b1', 'bc9159be-142f-417f-a45f-8d22f02739e5', 'https://placehold.co/600x400?text=Central+Perk+Fish+&+Chips', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('494c9626-18e1-4ae5-af45-1b0867b2e5c1', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Tacos', 'Delicious Tacos prepared with fresh ingredients.', 25, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('494c9626-18e1-4ae5-af45-1b0867b2e5c1', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c5429a19-1b9c-46e3-a159-e05d7432218e', '494c9626-18e1-4ae5-af45-1b0867b2e5c1', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8009adf7-2b77-47ad-8762-c724f0e097e5', '494c9626-18e1-4ae5-af45-1b0867b2e5c1', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('20eae186-6062-4d54-b093-f24bfb62f058', '494c9626-18e1-4ae5-af45-1b0867b2e5c1', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0215c90c-6a9d-4612-a46b-43c89c23bbd7', '494c9626-18e1-4ae5-af45-1b0867b2e5c1', 'https://placehold.co/600x400?text=Central+Perk+Tacos', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('dfc9e9b6-5d6a-48a9-af50-fbf1a4195f95', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Lasagna', 'Delicious Lasagna prepared with fresh ingredients.', 24, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('dfc9e9b6-5d6a-48a9-af50-fbf1a4195f95', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('df31091e-4da3-4677-8fb7-47f38a461660', 'dfc9e9b6-5d6a-48a9-af50-fbf1a4195f95', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('06f5032f-3626-4ec3-b243-86c6fc35b6c9', 'dfc9e9b6-5d6a-48a9-af50-fbf1a4195f95', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('680f8d4c-6cba-4a6a-8014-8fc0de0fc8a5', 'dfc9e9b6-5d6a-48a9-af50-fbf1a4195f95', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('4b267110-87be-4f24-b289-b476c0cfc80a', 'dfc9e9b6-5d6a-48a9-af50-fbf1a4195f95', 'https://placehold.co/600x400?text=Central+Perk+Lasagna', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('ac1bdb10-62af-4780-a0c5-07799358b3d0', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Risotto', 'Delicious Risotto prepared with fresh ingredients.', 19, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('ac1bdb10-62af-4780-a0c5-07799358b3d0', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('51ec0646-cf19-44b6-b2e9-8991e0325eb2', 'ac1bdb10-62af-4780-a0c5-07799358b3d0', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('09775719-0dd9-49d0-850d-3cc8e967d977', 'ac1bdb10-62af-4780-a0c5-07799358b3d0', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('105dcf7e-3768-40a6-94de-f91ccfd529a3', 'ac1bdb10-62af-4780-a0c5-07799358b3d0', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6d1520b3-74cb-44ed-9070-8a1b6fb3580d', 'ac1bdb10-62af-4780-a0c5-07799358b3d0', 'https://placehold.co/600x400?text=Central+Perk+Risotto', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('9a9b703c-17d2-41c9-b5e2-8d1356177914', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '707de6ee-e570-4df4-b62b-9addf4900e89', 'Central Perk Sandwich', 'Delicious Sandwich prepared with fresh ingredients.', 19, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('9a9b703c-17d2-41c9-b5e2-8d1356177914', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('aa4be1a6-02af-4e2e-8d8d-c91afc3711bb', '9a9b703c-17d2-41c9-b5e2-8d1356177914', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f8712014-1b4d-4028-be86-2d12fdc95f07', '9a9b703c-17d2-41c9-b5e2-8d1356177914', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('3c196726-345a-43a5-8214-e1b70b803836', '9a9b703c-17d2-41c9-b5e2-8d1356177914', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d9ab4a37-8422-4438-8187-4b4ece0ec248', '9a9b703c-17d2-41c9-b5e2-8d1356177914', 'https://placehold.co/600x400?text=Central+Perk+Sandwich', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('c5eb1ff6-aefa-4562-bab1-580875e60a15', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Ice Cream', 'Delicious Ice Cream prepared with fresh ingredients.', 15, 'available', false, 4.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('c5eb1ff6-aefa-4562-bab1-580875e60a15', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9fc299a1-9d04-4d18-b300-8bb4f6043ad0', 'c5eb1ff6-aefa-4562-bab1-580875e60a15', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('41400d8b-6aa4-4f18-9065-976b9632d199', 'c5eb1ff6-aefa-4562-bab1-580875e60a15', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('15a9eb4d-45c6-4eed-97a6-fa1dd6eaad13', 'c5eb1ff6-aefa-4562-bab1-580875e60a15', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Yummy', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('d3ab4a9b-e91d-4783-8231-9398313ae4a2', 'c5eb1ff6-aefa-4562-bab1-580875e60a15', 'https://placehold.co/600x400?text=Central+Perk+Ice+Cream', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('7ff75cb1-36bb-4d5b-83c1-293ecd592898', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Cake', 'Delicious Cake prepared with fresh ingredients.', 21, 'available', true, 3.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('7ff75cb1-36bb-4d5b-83c1-293ecd592898', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('be28e06d-ca6c-446b-bc30-e9a6f807a066', '7ff75cb1-36bb-4d5b-83c1-293ecd592898', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('1d61b311-b640-46ef-b0f0-ac0894f93654', '7ff75cb1-36bb-4d5b-83c1-293ecd592898', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2486b225-dfc7-4311-8bda-cdadea1f4235', '7ff75cb1-36bb-4d5b-83c1-293ecd592898', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3870b8c4-753f-493f-a159-4094b07db731', '7ff75cb1-36bb-4d5b-83c1-293ecd592898', 'https://placehold.co/600x400?text=Central+Perk+Cake', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('1ddf3129-3ce9-4b24-8cb2-12531bb4593d', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Pie', 'Delicious Pie prepared with fresh ingredients.', 7, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('1ddf3129-3ce9-4b24-8cb2-12531bb4593d', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('c805334f-140b-43b6-b7ca-fd712cf9124c', '1ddf3129-3ce9-4b24-8cb2-12531bb4593d', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a9ece192-6b71-4771-86e8-c48e64a1c193', '1ddf3129-3ce9-4b24-8cb2-12531bb4593d', 'cfee657d-5498-4806-9e43-22f580596971', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2ffd41e9-97b4-41a7-a660-618a581c1792', '1ddf3129-3ce9-4b24-8cb2-12531bb4593d', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6e472479-7001-48ef-952c-344440ff3ec2', '1ddf3129-3ce9-4b24-8cb2-12531bb4593d', 'https://placehold.co/600x400?text=Central+Perk+Pie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('a680b70f-727c-4b46-a11b-6531406937c0', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Brownie', 'Delicious Brownie prepared with fresh ingredients.', 13, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('a680b70f-727c-4b46-a11b-6531406937c0', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7a9d7233-ae5d-45b7-ad4b-c096f651a8ba', 'a680b70f-727c-4b46-a11b-6531406937c0', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('00e20f06-2dcb-41a2-992e-f6d23884df7c', 'a680b70f-727c-4b46-a11b-6531406937c0', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5cb33c57-9d49-439c-895e-bf5dc15e678f', 'a680b70f-727c-4b46-a11b-6531406937c0', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6fd94f61-90fc-4f8b-ad0d-b858eaac38f4', 'a680b70f-727c-4b46-a11b-6531406937c0', 'https://placehold.co/600x400?text=Central+Perk+Brownie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('43d6bda2-f512-4564-951b-b52c37ea883f', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Tiramisu', 'Delicious Tiramisu prepared with fresh ingredients.', 22, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('43d6bda2-f512-4564-951b-b52c37ea883f', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b7252760-6714-4de8-bcde-ed85db253d19', '43d6bda2-f512-4564-951b-b52c37ea883f', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d9d9f400-1e25-4f0a-92da-b67bf1f441fb', '43d6bda2-f512-4564-951b-b52c37ea883f', 'd0087c90-7e3a-4536-91df-e26625a09e81', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('a5bc7bd8-ec89-40f9-94b9-18a6c6d91122', '43d6bda2-f512-4564-951b-b52c37ea883f', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('0e98fdcd-942d-4f4c-b827-1260193cd64c', '43d6bda2-f512-4564-951b-b52c37ea883f', 'https://placehold.co/600x400?text=Central+Perk+Tiramisu', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('5f6796d4-dcd0-48a2-aff4-38ed33cdb2d0', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Pudding', 'Delicious Pudding prepared with fresh ingredients.', 12, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('5f6796d4-dcd0-48a2-aff4-38ed33cdb2d0', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9adf4298-4ec1-4b5a-9b75-7a6b24300de6', '5f6796d4-dcd0-48a2-aff4-38ed33cdb2d0', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('cefe3159-abeb-41a0-910c-7f9c7acaece1', '5f6796d4-dcd0-48a2-aff4-38ed33cdb2d0', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 5, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('96fe74a3-7d1e-47b8-9e2f-72211ef0c40d', '5f6796d4-dcd0-48a2-aff4-38ed33cdb2d0', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('e118a7d1-83e1-4061-80ee-7e94d48cd222', '5f6796d4-dcd0-48a2-aff4-38ed33cdb2d0', 'https://placehold.co/600x400?text=Central+Perk+Pudding', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('ce4bc772-8cf2-4299-928d-ed9077ff437a', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Tart', 'Delicious Tart prepared with fresh ingredients.', 11, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('ce4bc772-8cf2-4299-928d-ed9077ff437a', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('8c7fdf5e-7e15-4cb9-a4b1-0792728d1b71', 'ce4bc772-8cf2-4299-928d-ed9077ff437a', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('49531ed0-650f-4253-bd74-8878afd7bd45', 'ce4bc772-8cf2-4299-928d-ed9077ff437a', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0ada3ee6-4b62-4afc-bde2-0683a8775355', 'ce4bc772-8cf2-4299-928d-ed9077ff437a', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('7333a2af-6fe6-4270-a910-72825afaaac6', 'ce4bc772-8cf2-4299-928d-ed9077ff437a', 'https://placehold.co/600x400?text=Central+Perk+Tart', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('f78ae7d7-684a-48aa-8b14-f142b63436b2', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Cookie', 'Delicious Cookie prepared with fresh ingredients.', 21, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('f78ae7d7-684a-48aa-8b14-f142b63436b2', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('b9b58e34-bc16-4484-8ae1-bd014498dd7f', 'f78ae7d7-684a-48aa-8b14-f142b63436b2', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('24f658d4-abe5-4ee9-81a0-948bfde6cdeb', 'f78ae7d7-684a-48aa-8b14-f142b63436b2', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9e3d37f3-e0ec-4e39-8725-2a70597e1c22', 'f78ae7d7-684a-48aa-8b14-f142b63436b2', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('b9ab6c1b-d70d-4e6a-ac53-a6b73e3a7fde', 'f78ae7d7-684a-48aa-8b14-f142b63436b2', 'https://placehold.co/600x400?text=Central+Perk+Cookie', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('9869d114-8a44-4987-811b-ceff8af5680e', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Sorbet', 'Delicious Sorbet prepared with fresh ingredients.', 8, 'available', true, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('9869d114-8a44-4987-811b-ceff8af5680e', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dde367d2-1ad5-47f1-8187-0947a036759f', '9869d114-8a44-4987-811b-ceff8af5680e', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('df919132-47f8-4425-88ae-ada90218255b', '9869d114-8a44-4987-811b-ceff8af5680e', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d2447051-f846-4fb1-8319-3c904d1a89ea', '9869d114-8a44-4987-811b-ceff8af5680e', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Best dish ever', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3c811e61-7965-4766-921a-e4b929e67b8c', '9869d114-8a44-4987-811b-ceff8af5680e', 'https://placehold.co/600x400?text=Central+Perk+Sorbet', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('14b54a6f-5d1c-4b8b-8759-db8d979bf224', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', '08bdb6a9-6246-417c-9b9a-8abb29efe8e8', 'Central Perk Mousse', 'Delicious Mousse prepared with fresh ingredients.', 7, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('14b54a6f-5d1c-4b8b-8759-db8d979bf224', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('6f8f901a-cda0-4832-8440-56f11a1c59e4', '14b54a6f-5d1c-4b8b-8759-db8d979bf224', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e2dc21e3-2aa2-4bd3-bbf2-e7173cac2ccb', '14b54a6f-5d1c-4b8b-8759-db8d979bf224', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('704653a5-0454-40b3-8bcc-9be4e8f5dd7b', '14b54a6f-5d1c-4b8b-8759-db8d979bf224', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6b64ee24-9e59-4f2a-bf5d-699a713e6dc3', '14b54a6f-5d1c-4b8b-8759-db8d979bf224', 'https://placehold.co/600x400?text=Central+Perk+Mousse', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('2384741c-0cf7-4c57-98eb-02e306fd93ae', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Coke', 'Delicious Coke prepared with fresh ingredients.', 23, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('2384741c-0cf7-4c57-98eb-02e306fd93ae', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d3a87acd-b0fd-443e-9c7d-76caabed6a07', '2384741c-0cf7-4c57-98eb-02e306fd93ae', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('5eeba163-78e1-4235-a2ab-12b453ec8c86', '2384741c-0cf7-4c57-98eb-02e306fd93ae', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('206481b4-2d26-43cf-a970-d67596f6e0a2', '2384741c-0cf7-4c57-98eb-02e306fd93ae', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('6d9e3e4b-c4ea-4523-a306-b9f391064b7f', '2384741c-0cf7-4c57-98eb-02e306fd93ae', 'https://placehold.co/600x400?text=Central+Perk+Coke', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('a72ce0ed-0819-4def-8dd8-85897e20c562', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Water', 'Delicious Water prepared with fresh ingredients.', 23, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('a72ce0ed-0819-4def-8dd8-85897e20c562', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fdbeb5fb-04e3-476b-b734-121f69b51315', 'a72ce0ed-0819-4def-8dd8-85897e20c562', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 4, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ace8819c-cb38-494e-8306-d0f6741df640', 'a72ce0ed-0819-4def-8dd8-85897e20c562', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('ea2c45a6-90a6-497e-a641-cbf54dac18b4', 'a72ce0ed-0819-4def-8dd8-85897e20c562', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c764aa07-1f44-413b-b564-9b4689c4641b', 'a72ce0ed-0819-4def-8dd8-85897e20c562', 'https://placehold.co/600x400?text=Central+Perk+Water', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('a107e656-10c7-4b9b-9c1b-903608815590', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Juice', 'Delicious Juice prepared with fresh ingredients.', 26, 'available', false, 3.7, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('a107e656-10c7-4b9b-9c1b-903608815590', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9aa942ec-23c7-47b0-9eb8-beebc82d7289', 'a107e656-10c7-4b9b-9c1b-903608815590', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fc72bab7-fef1-4e96-94dc-62b7223774a0', 'a107e656-10c7-4b9b-9c1b-903608815590', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('f1e6a1a9-601f-4083-8456-a0eb50e9e3db', 'a107e656-10c7-4b9b-9c1b-903608815590', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Okay', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('3b5cae79-f2db-4112-8a23-a6554dff7002', 'a107e656-10c7-4b9b-9c1b-903608815590', 'https://placehold.co/600x400?text=Central+Perk+Juice', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('552e891c-90fd-4a79-bbae-feb6735c173e', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Tea', 'Delicious Tea prepared with fresh ingredients.', 15, 'available', true, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('552e891c-90fd-4a79-bbae-feb6735c173e', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2b118c80-4c26-4097-ba94-306df3cba0b1', '552e891c-90fd-4a79-bbae-feb6735c173e', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 5, 'Okay', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('20a5ce6f-baad-415c-aa4c-0c088b3c8cb1', '552e891c-90fd-4a79-bbae-feb6735c173e', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2f55664f-185f-494b-880f-98e393835421', '552e891c-90fd-4a79-bbae-feb6735c173e', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 5, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('b3986802-b29a-48a2-add1-389fe1937b25', '552e891c-90fd-4a79-bbae-feb6735c173e', 'https://placehold.co/600x400?text=Central+Perk+Tea', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('e1609e6a-4477-4683-962a-c46b44d232da', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Coffee', 'Delicious Coffee prepared with fresh ingredients.', 26, 'available', false, 4.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('e1609e6a-4477-4683-962a-c46b44d232da', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2fa9e330-8207-4999-9fd7-eb716f58008a', 'e1609e6a-4477-4683-962a-c46b44d232da', '01a191d7-0785-4aa9-ad88-0952176154a9', 5, 'Great!', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('7883a628-a918-4e34-834b-6e508d5c85ba', 'e1609e6a-4477-4683-962a-c46b44d232da', '6984f761-58ee-4f92-be4e-9398219ec041', 5, 'Delicious', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('24f702b1-c66c-44b6-9206-5e6ff8fdd5d2', 'e1609e6a-4477-4683-962a-c46b44d232da', 'd678408b-1c7e-4a14-80ca-dce1d38a9cb0', 3, 'Delicious', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('00d913a3-d3c7-4730-8311-e1dc5590bb70', 'e1609e6a-4477-4683-962a-c46b44d232da', 'https://placehold.co/600x400?text=Central+Perk+Coffee', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('050ad179-1a06-4a32-bc63-55f7bdf5cdeb', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Beer', 'Delicious Beer prepared with fresh ingredients.', 30, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('050ad179-1a06-4a32-bc63-55f7bdf5cdeb', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('254c8470-fb05-4ba9-a198-f3fa894b769d', '050ad179-1a06-4a32-bc63-55f7bdf5cdeb', '01a191d7-0785-4aa9-ad88-0952176154a9', 3, 'Good', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('9e30cf91-e679-4d87-91b2-46007765a97c', '050ad179-1a06-4a32-bc63-55f7bdf5cdeb', 'fb2a5e7f-9733-437e-b218-2d88e5ab0a01', 4, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('621456a4-3f36-471b-8870-a5c1107f993b', '050ad179-1a06-4a32-bc63-55f7bdf5cdeb', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('311200bb-d825-46fe-9008-33e131ecd964', '050ad179-1a06-4a32-bc63-55f7bdf5cdeb', 'https://placehold.co/600x400?text=Central+Perk+Beer', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('d794fd8b-df7e-4800-bf19-127b70b15669', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Wine', 'Delicious Wine prepared with fresh ingredients.', 28, 'available', false, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('d794fd8b-df7e-4800-bf19-127b70b15669', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('2753f704-ec34-4740-9137-2c23e34c2261', 'd794fd8b-df7e-4800-bf19-127b70b15669', 'd0087c90-7e3a-4536-91df-e26625a09e81', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('fe22c1dd-6f9c-4353-a444-d1a57c657576', 'd794fd8b-df7e-4800-bf19-127b70b15669', '6984f761-58ee-4f92-be4e-9398219ec041', 3, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('d9009f4a-ee14-4cc9-8a1c-8fc79703cf81', 'd794fd8b-df7e-4800-bf19-127b70b15669', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 4, 'Great!', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('c9eff60b-9a5c-4e74-9dae-ab7a0013a4c1', 'd794fd8b-df7e-4800-bf19-127b70b15669', 'https://placehold.co/600x400?text=Central+Perk+Wine', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('eaf414ce-6efe-4d7f-aec9-121bcaecc07a', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Soda', 'Delicious Soda prepared with fresh ingredients.', 30, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('eaf414ce-6efe-4d7f-aec9-121bcaecc07a', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e731faa2-75c5-4489-943c-7c760e6b48fe', 'eaf414ce-6efe-4d7f-aec9-121bcaecc07a', '01a191d7-0785-4aa9-ad88-0952176154a9', 4, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('bce6c5fe-f221-43e4-bd6b-fd14c7007191', 'eaf414ce-6efe-4d7f-aec9-121bcaecc07a', '4682ce25-59d7-4cb6-b69a-8b50f415290b', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('e9c49786-f2d5-40d3-be25-f8ca0ea48985', 'eaf414ce-6efe-4d7f-aec9-121bcaecc07a', '433ed30a-e381-4bb6-adb7-715ded5a5d47', 3, 'Loved it', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('282088dc-f136-4d26-a7ba-dbcc86f5d72d', 'eaf414ce-6efe-4d7f-aec9-121bcaecc07a', 'https://placehold.co/600x400?text=Central+Perk+Soda', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('a5bd2ec7-00e9-489c-b8ea-998cf5f4a423', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Lemonade', 'Delicious Lemonade prepared with fresh ingredients.', 6, 'available', true, 3.3, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('a5bd2ec7-00e9-489c-b8ea-998cf5f4a423', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('dbb89e53-4df3-4010-8daa-78ae98bb8d21', 'a5bd2ec7-00e9-489c-b8ea-998cf5f4a423', '8e3da32e-ad4d-4b34-a9c4-8a851a105049', 3, 'Loved it', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('613be919-27f6-4a62-a059-efd75d85f341', 'a5bd2ec7-00e9-489c-b8ea-998cf5f4a423', 'cfee657d-5498-4806-9e43-22f580596971', 4, 'Nice', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('58b416ef-6a4c-49a8-a0c0-ef8d95d053ec', 'a5bd2ec7-00e9-489c-b8ea-998cf5f4a423', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Nice', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('8c3f7291-3289-45fc-b7f8-715032f1b7a9', 'a5bd2ec7-00e9-489c-b8ea-998cf5f4a423', 'https://placehold.co/600x400?text=Central+Perk+Lemonade', true, NOW());
                

                INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_chef_recommended, average_rating, review_count, created_at, updated_at)
                VALUES ('712b85b5-c5d7-4168-ac5b-2a49b7981f5f', '3d22b9b6-e944-4e6e-af4c-f88d8963b51f', 'ec472eb3-a362-4d66-a84f-e845608f9694', 'Central Perk Smoothie', 'Delicious Smoothie prepared with fresh ingredients.', 13, 'available', true, 4.0, 3, NOW(), NOW());
                

                INSERT INTO menu_item_modifier_groups (menu_item_id, group_id)
                VALUES ('712b85b5-c5d7-4168-ac5b-2a49b7981f5f', '35bba00d-6d44-4cb3-a14b-16bc71a7b0da');
                

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('669e7d13-8ab2-44dd-9be4-e2abdbdbce56', '712b85b5-c5d7-4168-ac5b-2a49b7981f5f', '80872ac3-d4df-4075-9fa1-0a64d30d2773', 3, 'Best dish ever', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('eeb11eb1-0b8b-4131-8090-c86059d5eee2', '712b85b5-c5d7-4168-ac5b-2a49b7981f5f', 'd0087c90-7e3a-4536-91df-e26625a09e81', 5, 'Yummy', NOW(), NOW());
                    

                    INSERT INTO reviews (id, menu_item_id, user_id, rating, comment, created_at, updated_at)
                    VALUES ('0f133b6b-728e-49e7-8480-098394f1341b', '712b85b5-c5d7-4168-ac5b-2a49b7981f5f', '6984f761-58ee-4f92-be4e-9398219ec041', 4, 'Good', NOW(), NOW());
                    

                INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary, created_at)
                VALUES ('73c10022-6169-4d19-9e7c-80b2d23cd63c', '712b85b5-c5d7-4168-ac5b-2a49b7981f5f', 'https://placehold.co/600x400?text=Central+Perk+Smoothie', true, NOW());
                