-- Seed 50 Italian dishes for Italian Corner restaurant
-- Restaurant ID: f781086d-f298-4c8b-8ce7-f3cfb4662074

-- First, get a category ID (you may need to adjust this based on your categories)
-- Run this query first to see available categories:
-- SELECT id, name FROM menu_categories WHERE restaurant_id = 'f781086d-f298-4c8b-8ce7-f3cfb4662074';

-- Then replace 'YOUR_CATEGORY_ID' below with an actual category ID
-- Or the script will use the first available category

DO $$
DECLARE
    rest_id UUID := 'f781086d-f298-4c8b-8ce7-f3cfb4662074';
    cat_id UUID;
    appetizer_cat UUID;
    main_cat UUID;
    dessert_cat UUID;
    drink_cat UUID;
BEGIN
    -- Get category IDs (adjust names if needed)
    SELECT id INTO appetizer_cat FROM menu_categories 
    WHERE restaurant_id = rest_id AND LOWER(name) LIKE '%appetizer%' OR LOWER(name) LIKE '%starter%' LIMIT 1;
    
    SELECT id INTO main_cat FROM menu_categories 
    WHERE restaurant_id = rest_id AND (LOWER(name) LIKE '%main%' OR LOWER(name) LIKE '%entree%') LIMIT 1;
    
    SELECT id INTO dessert_cat FROM menu_categories 
    WHERE restaurant_id = rest_id AND LOWER(name) LIKE '%dessert%' LIMIT 1;
    
    SELECT id INTO drink_cat FROM menu_categories 
    WHERE restaurant_id = rest_id AND (LOWER(name) LIKE '%drink%' OR LOWER(name) LIKE '%beverage%') LIMIT 1;
    
    -- Fallback: use first category if specific ones not found
    IF main_cat IS NULL THEN
        SELECT id INTO main_cat FROM menu_categories WHERE restaurant_id = rest_id LIMIT 1;
    END IF;
    
    -- Appetizers & Starters (10 dishes)
    cat_id := COALESCE(appetizer_cat, main_cat);
    
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_deleted, is_chef_recommended, created_at, updated_at)
    SELECT gen_random_uuid(), rest_id, cat_id, name, description, price, 'active', false, is_chef, NOW(), NOW()
    FROM (VALUES
        ('Prosciutto e Melone', 'Sweet cantaloupe wrapped with Italian prosciutto', 95000, false),
        ('Calamari Fritti', 'Crispy fried squid rings with lemon aioli', 115000, true),
        ('Insalata Tricolore', 'Arugula, radicchio, and endive salad', 85000, false),
        ('Focaccia al Rosmarino', 'Homemade rosemary flatbread with olive oil', 65000, false),
        ('Burrata con Pomodorini', 'Creamy burrata cheese with cherry tomatoes', 125000, true),
        ('Cozze alla Marinara', 'Mussels in white wine and tomato sauce', 135000, false),
        ('Polpette al Sugo', 'Italian meatballs in tomato sauce', 105000, false),
        ('Vitello Tonnato Classico', 'Sliced veal with tuna sauce', 145000, false),
        ('Fritto Misto di Mare', 'Mixed fried seafood platter', 185000, true),
        ('Crostini Toscani', 'Tuscan chicken liver pâté on toasted bread', 75000, false)
    ) AS t(name, description, price, is_chef)
    WHERE NOT EXISTS (
        SELECT 1 FROM menu_items WHERE menu_items.name = t.name AND menu_items.restaurant_id = rest_id
    );

    -- Pasta Dishes (15 dishes)
    cat_id := COALESCE(main_cat, appetizer_cat);
    
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_deleted, is_chef_recommended, created_at, updated_at)
    SELECT gen_random_uuid(), rest_id, cat_id, name, description, price, 'active', false, is_chef, NOW(), NOW()
    FROM (VALUES
        ('Cacio e Pepe', 'Roman pasta with pecorino cheese and black pepper', 125000, true),
        ('Pasta alla Norma', 'Sicilian pasta with eggplant and ricotta salata', 135000, false),
        ('Orecchiette con Cime di Rapa', 'Ear-shaped pasta with turnip greens', 145000, false),
        ('Bucatini all''Amatriciana', 'Thick spaghetti with tomato, guanciale, and pecorino', 140000, true),
        ('Tagliatelle al Tartufo', 'Fresh ribbon pasta with black truffle sauce', 195000, true),
        ('Spaghetti alle Cozze', 'Spaghetti with mussels in white wine', 155000, false),
        ('Rigatoni alla Gricia', 'Roman pasta with guanciale and pecorino', 130000, false),
        ('Paccheri ai Frutti di Mare', 'Large tube pasta with mixed seafood', 175000, true),
        ('Trofie al Pesto Genovese', 'Ligurian pasta with traditional basil pesto', 135000, false),
        ('Pasta e Fagioli', 'Traditional pasta and bean soup', 95000, false),
        ('Cannelloni Ricotta e Spinaci', 'Baked pasta tubes with ricotta and spinach', 140000, false),
        ('Strozzapreti al Ragù Bianco', 'Hand-rolled pasta with white meat sauce', 145000, false),
        ('Spaghetti alla Puttanesca', 'Pasta with tomatoes, olives, capers, and anchovies', 125000, false),
        ('Maltagliati con Funghi', 'Irregular pasta shapes with wild mushrooms', 150000, true),
        ('Pasta alla Gricia e Zucchine', 'Pasta with guanciale and zucchini', 135000, false)
    ) AS t(name, description, price, is_chef)
    WHERE NOT EXISTS (
        SELECT 1 FROM menu_items WHERE menu_items.name = t.name AND menu_items.restaurant_id = rest_id
    );

    -- Risotto & Rice Dishes (5 dishes)
    cat_id := COALESCE(main_cat, appetizer_cat);
    
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_deleted, is_chef_recommended, created_at, updated_at)
    SELECT gen_random_uuid(), rest_id, cat_id, name, description, price, 'active', false, is_chef, NOW(), NOW()
    FROM (VALUES
        ('Risotto alla Milanese', 'Saffron risotto with bone marrow', 155000, true),
        ('Risotto ai Frutti di Mare', 'Seafood risotto with mixed shellfish', 175000, true),
        ('Risotto al Radicchio', 'Creamy risotto with red radicchio', 145000, false),
        ('Risotto allo Zafferano e Gamberi', 'Saffron risotto with prawns', 185000, true),
        ('Risi e Bisi', 'Venetian rice and peas', 125000, false)
    ) AS t(name, description, price, is_chef)
    WHERE NOT EXISTS (
        SELECT 1 FROM menu_items WHERE menu_items.name = t.name AND menu_items.restaurant_id = rest_id
    );

    -- Main Courses - Meat (8 dishes)
    cat_id := COALESCE(main_cat, appetizer_cat);
    
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_deleted, is_chef_recommended, created_at, updated_at)
    SELECT gen_random_uuid(), rest_id, cat_id, name, description, price, 'active', false, is_chef, NOW(), NOW()
    FROM (VALUES
        ('Tagliata di Manzo', 'Sliced grilled beef with arugula and parmesan', 295000, true),
        ('Scaloppine al Limone', 'Veal scaloppini in lemon butter sauce', 235000, false),
        ('Cotoletta alla Milanese', 'Breaded veal cutlet Milan style', 255000, true),
        ('Involtini di Vitello', 'Veal rolls stuffed with prosciutto and sage', 245000, false),
        ('Brasato al Barolo', 'Beef braised in Barolo wine', 315000, true),
        ('Agnello al Forno', 'Roasted lamb with rosemary and garlic', 275000, false),
        ('Trippa alla Romana', 'Roman-style tripe with tomato sauce', 165000, false),
        ('Fegato alla Veneziana', 'Venetian-style liver with onions', 185000, false)
    ) AS t(name, description, price, is_chef)
    WHERE NOT EXISTS (
        SELECT 1 FROM menu_items WHERE menu_items.name = t.name AND menu_items.restaurant_id = rest_id
    );

    -- Main Courses - Seafood (5 dishes)
    cat_id := COALESCE(main_cat, appetizer_cat);
    
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_deleted, is_chef_recommended, created_at, updated_at)
    SELECT gen_random_uuid(), rest_id, cat_id, name, description, price, 'active', false, is_chef, NOW(), NOW()
    FROM (VALUES
        ('Pesce Spada alla Siciliana', 'Sicilian-style swordfish with capers', 285000, true),
        ('Sogliola alla Mugnaia', 'Dover sole in butter and lemon', 295000, true),
        ('Gamberoni alla Griglia', 'Grilled king prawns with garlic', 325000, true),
        ('Cacciucco Livornese', 'Tuscan seafood stew', 245000, false),
        ('Seppie in Umido', 'Braised cuttlefish in tomato sauce', 195000, false)
    ) AS t(name, description, price, is_chef)
    WHERE NOT EXISTS (
        SELECT 1 FROM menu_items WHERE menu_items.name = t.name AND menu_items.restaurant_id = rest_id
    );

    -- Desserts (5 dishes)
    cat_id := COALESCE(dessert_cat, main_cat);
    
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_deleted, is_chef_recommended, created_at, updated_at)
    SELECT gen_random_uuid(), rest_id, cat_id, name, description, price, 'active', false, is_chef, NOW(), NOW()
    FROM (VALUES
        ('Zabaglione', 'Warm custard with Marsala wine', 75000, false),
        ('Semifreddo al Pistacchio', 'Pistachio semi-frozen dessert', 85000, true),
        ('Crostata di Frutta', 'Italian fruit tart with pastry cream', 80000, false),
        ('Biscotti di Prato', 'Tuscan almond cookies with Vin Santo', 55000, false),
        ('Budino al Cioccolato', 'Rich chocolate pudding', 70000, false)
    ) AS t(name, description, price, is_chef)
    WHERE NOT EXISTS (
        SELECT 1 FROM menu_items WHERE menu_items.name = t.name AND menu_items.restaurant_id = rest_id
    );

    -- Drinks (2 dishes)
    cat_id := COALESCE(drink_cat, main_cat);
    
    INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, status, is_deleted, is_chef_recommended, created_at, updated_at)
    SELECT gen_random_uuid(), rest_id, cat_id, name, description, price, 'active', false, is_chef, NOW(), NOW()
    FROM (VALUES
        ('Negroni', 'Classic Italian cocktail with gin, vermouth, and Campari', 95000, false),
        ('Bellini', 'Prosecco with white peach purée', 85000, false)
    ) AS t(name, description, price, is_chef)
    WHERE NOT EXISTS (
        SELECT 1 FROM menu_items WHERE menu_items.name = t.name AND menu_items.restaurant_id = rest_id
    );

    RAISE NOTICE '✅ Italian dishes seeding completed!';
END $$;

-- Verify the results
SELECT COUNT(*) as total_items 
FROM menu_items 
WHERE restaurant_id = 'f781086d-f298-4c8b-8ce7-f3cfb4662074' 
AND is_deleted = false;
