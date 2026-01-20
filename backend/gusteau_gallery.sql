-- Auto-generated Gusteau Gallery Images

-- Images for Gusteau's Pasta

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pasta'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pasta'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pasta'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80'
);

-- Images for Gusteau's Curry

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Curry'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1631296245207-b4ce70a831e6?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Curry'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1631296245207-b4ce70a831e6?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Curry'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80'
);

-- Images for Gusteau's Fish & Chips

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1534938665420-4193effeacc4?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Fish & Chips'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1534938665420-4193effeacc4?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Fish & Chips'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Fish & Chips'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=800&q=80'
);

-- Images for Gusteau's Tacos

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tacos'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tacos'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tacos'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&q=80'
);

-- Images for Gusteau's Lasagna

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1574868352513-716363c1c1b5?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Lasagna'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1574868352513-716363c1c1b5?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1626844131082-256783844137?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Lasagna'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1626844131082-256783844137?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1629115916087-73f5c701a590?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Lasagna'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1629115916087-73f5c701a590?w=800&q=80'
);

-- Images for Gusteau's Risotto

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Risotto'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1633504892305-645366474930?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Risotto'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1633504892305-645366474930?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Risotto'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80'
);

-- Images for Gusteau's Sandwich

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Sandwich'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Sandwich'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Sandwich'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&q=80'
);

-- Images for Gusteau's Ice Cream

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Ice Cream'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Ice Cream'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Ice Cream'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80'
);

-- Images for Gusteau's Cake

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Cake'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Cake'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Cake'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&q=80'
);

-- Images for Gusteau's Pie

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1572383672419-ab4779988814?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1572383672419-ab4779988814?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1519915093129-c5f9f60b9c3e?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1519915093129-c5f9f60b9c3e?w=800&q=80'
);

-- Images for Gusteau's Brownie

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Brownie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Brownie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Brownie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=800&q=80'
);

-- Images for Gusteau's Tiramisu

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tiramisu'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1582298642398-7cf169ab77de?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tiramisu'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1582298642398-7cf169ab77de?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1543362140-5b62b0b144fa?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tiramisu'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1543362140-5b62b0b144fa?w=800&q=80'
);

-- Images for Gusteau's Pudding

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1517093720242-8e01b6951493?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pudding'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1517093720242-8e01b6951493?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1543884351-e7890dd28075?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pudding'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1543884351-e7890dd28075?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1596707323564-d621b142980d?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pudding'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1596707323564-d621b142980d?w=800&q=80'
);

-- Images for Gusteau's Tart

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tart'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1509456208573-04ae2ce02538?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tart'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1509456208573-04ae2ce02538?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1488477181946-6428a029177b?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tart'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1488477181946-6428a029177b?w=800&q=80'
);

-- Images for Gusteau's Cookie

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1499636136210-6f4ee9179d6d?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Cookie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1499636136210-6f4ee9179d6d?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1560526017-bd92ee90b83e?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Cookie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1560526017-bd92ee90b83e?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Cookie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80'
);

-- Images for Gusteau's Sorbet

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Sorbet'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1502663952763-7188f6c6d042?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Sorbet'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1502663952763-7188f6c6d042?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Sorbet'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80'
);

-- Images for Gusteau's Mousse

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1549405664-887714652273?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Mousse'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1549405664-887714652273?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Mousse'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1579954115545-a95591f28dfc?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Mousse'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1579954115545-a95591f28dfc?w=800&q=80'
);

-- Images for Gusteau's Coke

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Coke'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Coke'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Coke'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&q=80'
);

-- Images for Gusteau's Water

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1525385133512-2f346b384390?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Water'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1525385133512-2f346b384390?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Water'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1559839914-17a0b2f29304?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Water'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1559839914-17a0b2f29304?w=800&q=80'
);

-- Images for Gusteau's Juice

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Juice'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Juice'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Juice'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80'
);

-- Images for Gusteau's Tea

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tea'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tea'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1564890369478-c5bc7ade70f4?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Tea'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1564890369478-c5bc7ade70f4?w=800&q=80'
);

-- Images for Gusteau's Coffee

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Coffee'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Coffee'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Coffee'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80'
);

-- Images for Gusteau's Beer

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1535958636474-b021ee8874a3?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Beer'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1535958636474-b021ee8874a3?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1618183182246-1bf435df756b?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Beer'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1618183182246-1bf435df756b?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1608272486229-760868f03c03?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Beer'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1608272486229-760868f03c03?w=800&q=80'
);

-- Images for Gusteau's Wine

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Wine'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1474722883778-792e799423d6?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Wine'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1474722883778-792e799423d6?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Wine'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=800&q=80'
);

-- Images for Gusteau's Soda

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Soda'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Soda'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Soda'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80'
);

-- Images for Gusteau's Lemonade

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Lemonade'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Lemonade'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1549405664-887714652273?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Lemonade'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1549405664-887714652273?w=800&q=80'
);

-- Images for Gusteau's Smoothie

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Smoothie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Smoothie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Smoothie'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80'
);

-- Images for Gusteau's Spring Rolls

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1544510802-ac42b6a22b7a?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Spring Rolls'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1544510802-ac42b6a22b7a?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1634509176378-438497fa2393?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Spring Rolls'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1634509176378-438497fa2393?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1626804475297-411f7a685e19?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Spring Rolls'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1626804475297-411f7a685e19?w=800&q=80'
);

-- Images for Gusteau's Garlic Bread

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1573140247632-f84660f67627?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Garlic Bread'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1573140247632-f84660f67627?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1619531040576-f399d480d856?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Garlic Bread'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1619531040576-f399d480d856?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1608835291093-3953e2e3e8be?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Garlic Bread'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1608835291093-3953e2e3e8be?w=800&q=80'
);

-- Images for Gusteau's Soup

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Soup'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Soup'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Soup'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80'
);

-- Images for Gusteau's Salad

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Salad'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Salad'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Salad'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80'
);

-- Images for Gusteau's Wings

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1527477396000-64ca9c02d732?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Wings'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1527477396000-64ca9c02d732?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1569691899455-59eb77805178?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Wings'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1569691899455-59eb77805178?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Wings'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80'
);

-- Images for Gusteau's Fries

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Fries'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Fries'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1585109649139-3668018951a7?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Fries'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1585109649139-3668018951a7?w=800&q=80'
);

-- Images for Gusteau's Nachos

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Nachos'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1576098045237-7798361021bc?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Nachos'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1576098045237-7798361021bc?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1616239103823-38029fa035d8?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Nachos'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1616239103823-38029fa035d8?w=800&q=80'
);

-- Images for Gusteau's Calamari

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Calamari'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Calamari'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1544061559-99436fc7dd7f?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Calamari'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1544061559-99436fc7dd7f?w=800&q=80'
);

-- Images for Gusteau's Bruschetta

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1572695157363-bc31940195e5?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Bruschetta'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1572695157363-bc31940195e5?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Bruschetta'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1594974984714-2795c65f04a5?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Bruschetta'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1594974984714-2795c65f04a5?w=800&q=80'
);

-- Images for Gusteau's Dumplings

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1541696490-8744a570242e?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Dumplings'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1541696490-8744a570242e?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Dumplings'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1496116218417-1a781b1c423c?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Dumplings'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1496116218417-1a781b1c423c?w=800&q=80'
);

-- Images for Gusteau's Steak

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Steak'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Steak'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Steak'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'
);

-- Images for Gusteau's Pizza

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pizza'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pizza'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80'
);

INSERT INTO menu_item_photos (id, menu_item_id, url, is_primary)
SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1593560708920-638928ce75ec?w=800&q=80', false 
FROM menu_items 
WHERE name = 'Gusteau''s Pizza'
AND NOT EXISTS (
    SELECT 1 FROM menu_item_photos 
    WHERE menu_item_id = menu_items.id 
    AND url = 'https://images.unsplash.com/photo-1593560708920-638928ce75ec?w=800&q=80'
);

