# Migration và Seed cho Multi-Restaurant System

## Bước 1: Chạy migration để tạo bảng restaurants

```bash
cd backend
# Chạy migration SQL
psql $DATABASE_URL -f prisma/migrations/003_create_restaurants_table.sql
```

Hoặc nếu dùng Prisma migrate:
```bash
npx prisma migrate dev --name create_restaurants_table
```

## Bước 2: Generate Prisma Client mới

```bash
npx prisma generate
```

## Bước 3: Seed restaurants data

```bash
npx ts-node prisma/seedRestaurants.ts
```

## Bước 4: Update existing data (Optional)

Nếu database đã có data categories và tables, cần update restaurant_id:

```sql
-- Update menu_categories to use first restaurant
UPDATE menu_categories 
SET restaurant_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' 
WHERE restaurant_id IS NULL OR restaurant_id != 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Update tables to use first restaurant
UPDATE tables 
SET restaurant_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' 
WHERE restaurant_id IS NULL;
```

## Verify

```bash
# Check restaurants
SELECT * FROM restaurants;

# Check tables with restaurant
SELECT t.*, r.name as restaurant_name FROM tables t 
LEFT JOIN restaurants r ON t.restaurant_id = r.id;

# Check categories with restaurant
SELECT mc.*, r.name as restaurant_name FROM menu_categories mc
LEFT JOIN restaurants r ON mc.restaurant_id = r.id;
```
