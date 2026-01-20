-- Add multiple images for "Gusteau's Burger"

-- First, ensure we don't have duplicate primary images if we are re-running this (optional cleanup)
-- DELETE FROM menu_item_photos WHERE menu_item_idIn (SELECT id FROM menu_items WHERE name = 'Gusteau''s Burger');

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT 
    gen_random_uuid(), 
    id, 
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 
    false 
FROM menu_items WHERE name = 'Gusteau''s Burger'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT 
    gen_random_uuid(), 
    id, 
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80', -- Burger Close up
    false 
FROM menu_items WHERE name = 'Gusteau''s Burger'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT 
    gen_random_uuid(), 
    id, 
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80', -- Burger with Fries
    false 
FROM menu_items WHERE name = 'Gusteau''s Burger'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT 
    gen_random_uuid(), 
    id, 
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80', -- Burger Side View
    false 
FROM menu_items WHERE name = 'Gusteau''s Burger'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80'
);
