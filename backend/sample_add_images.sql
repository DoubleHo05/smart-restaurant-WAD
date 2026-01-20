-- Sample SQL: Add 2 images for Gusteau's Pizza
-- Replace the URLs with your actual image URLs

-- Image 1
INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'YOUR_IMAGE_URL_1_HERE', false 
FROM menu_items 
WHERE name = 'Gusteau''s Beer'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
);

-- Image 2
INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'YOUR_IMAGE_URL_2_HERE', false 
FROM menu_items 
WHERE name = 'Gusteau''s Beer'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
);
