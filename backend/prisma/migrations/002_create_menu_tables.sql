-- Create menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (restaurant_id, name)
);

CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_status ON menu_categories(status);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    category_id UUID NOT NULL,
    name VARCHAR(80) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL CHECK (price > 0),
    prep_time_minutes INT DEFAULT 0 CHECK (prep_time_minutes >= 0 AND prep_time_minutes <= 240),
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'unavailable', 'sold_out')),
    is_chef_recommended BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id)
);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_status ON menu_items(status);

-- Create menu_item_photos table
CREATE TABLE IF NOT EXISTS menu_item_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id UUID NOT NULL,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_menu_item_photos_item ON menu_item_photos(menu_item_id);

-- Create modifier_groups table
CREATE TABLE IF NOT EXISTS modifier_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    name VARCHAR(80) NOT NULL,
    selection_type VARCHAR(20) NOT NULL CHECK (selection_type IN ('single', 'multiple')),
    is_required BOOLEAN DEFAULT FALSE,
    min_selections INT DEFAULT 0,
    max_selections INT DEFAULT 0,
    display_order INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create modifier_options table
CREATE TABLE IF NOT EXISTS modifier_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    name VARCHAR(80) NOT NULL,
    price_adjustment DECIMAL(12,2) DEFAULT 0 CHECK (price_adjustment >= 0),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES modifier_groups(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_modifier_options_group ON modifier_options(group_id);

-- Create menu_item_modifier_groups junction table
CREATE TABLE IF NOT EXISTS menu_item_modifier_groups (
    menu_item_id UUID NOT NULL,
    group_id UUID NOT NULL,
    PRIMARY KEY (menu_item_id, group_id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES modifier_groups(id) ON DELETE CASCADE
);

-- Insert sample data for testing
-- Sample restaurant_id (using a fixed UUID for consistency)
DO $$
DECLARE
    sample_restaurant_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    category_appetizers UUID;
    category_main UUID;
    category_drinks UUID;
    item_pho UUID;
    item_bun_cha UUID;
    item_com_tam UUID;
    modifier_size UUID;
    modifier_extras UUID;
BEGIN
    -- Insert categories
    INSERT INTO menu_categories (id, restaurant_id, name, description, display_order, status) VALUES
    (gen_random_uuid(), sample_restaurant_id, 'Appetizers', 'Start your meal right', 1, 'active')
    RETURNING id INTO category_appetizers;
    
    INSERT INTO menu_categories (id, restaurant_id, name, description, display_order, status) VALUES
    (gen_random_uuid(), sample_restaurant_id, 'Main Courses', 'Our signature dishes', 2, 'active')
    RETURNING id INTO category_main;
    
    INSERT INTO menu_categories (id, restaurant_id, name, description, display_order, status) VALUES
    (gen_random_uuid(), sample_restaurant_id, 'Drinks', 'Refreshing beverages', 3, 'active')
    RETURNING id INTO category_drinks;

    -- Insert menu items
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended) VALUES
    (gen_random_uuid(), sample_restaurant_id, category_main, 'Phở Bò', 'Traditional Vietnamese beef noodle soup', 50000, 15, 'available', true)
    RETURNING id INTO item_pho;
    
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended) VALUES
    (gen_random_uuid(), sample_restaurant_id, category_main, 'Bún Chả', 'Grilled pork with vermicelli noodles', 45000, 20, 'available', true)
    RETURNING id INTO item_bun_cha;
    
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, prep_time_minutes, status, is_chef_recommended) VALUES
    (gen_random_uuid(), sample_restaurant_id, category_main, 'Cơm Tấm', 'Broken rice with grilled pork', 40000, 15, 'available', false)
    RETURNING id INTO item_com_tam;

    -- Insert sample photos
    INSERT INTO menu_item_photos (menu_item_id, url, is_primary) VALUES
    (item_pho, '/uploads/pho-bo-1.jpg', true),
    (item_pho, '/uploads/pho-bo-2.jpg', false),
    (item_bun_cha, '/uploads/bun-cha-1.jpg', true),
    (item_com_tam, '/uploads/com-tam-1.jpg', true);

    -- Insert modifier groups
    INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, display_order) VALUES
    (gen_random_uuid(), sample_restaurant_id, 'Size', 'single', true, 1, 1, 1)
    RETURNING id INTO modifier_size;
    
    INSERT INTO modifier_groups (id, restaurant_id, name, selection_type, is_required, min_selections, max_selections, display_order) VALUES
    (gen_random_uuid(), sample_restaurant_id, 'Extras', 'multiple', false, 0, 3, 2)
    RETURNING id INTO modifier_extras;

    -- Insert modifier options
    INSERT INTO modifier_options (group_id, name, price_adjustment) VALUES
    (modifier_size, 'Small', 0),
    (modifier_size, 'Medium', 5000),
    (modifier_size, 'Large', 10000),
    (modifier_extras, 'Extra Meat', 15000),
    (modifier_extras, 'Extra Vegetables', 5000),
    (modifier_extras, 'Egg', 5000);

    -- Attach modifiers to items
    INSERT INTO menu_item_modifier_groups (menu_item_id, group_id) VALUES
    (item_pho, modifier_size),
    (item_pho, modifier_extras),
    (item_bun_cha, modifier_size),
    (item_bun_cha, modifier_extras);

END $$;
