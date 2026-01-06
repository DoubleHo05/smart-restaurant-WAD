-- Create OrderStatus enum type
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'accepted', 'preparing', 'ready', 'served', 'completed');

-- Create orders table
CREATE TABLE IF NOT EXISTS "orders" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "restaurant_id" UUID NOT NULL,
    "table_id" UUID NOT NULL,
    "customer_id" UUID,
    "order_number" VARCHAR(50) UNIQUE NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "subtotal" DECIMAL(12, 2) NOT NULL,
    "tax" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12, 2) NOT NULL,
    "special_requests" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(6),
    "preparing_at" TIMESTAMP(6),
    "ready_at" TIMESTAMP(6),
    "served_at" TIMESTAMP(6),
    "completed_at" TIMESTAMP(6),
    CONSTRAINT "orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for orders table
CREATE INDEX "orders_restaurant_id_idx" ON "orders"("restaurant_id");
CREATE INDEX "orders_table_id_idx" ON "orders"("table_id");
CREATE INDEX "orders_customer_id_idx" ON "orders"("customer_id");
CREATE INDEX "orders_status_idx" ON "orders"("status");
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");

-- Create order_items table
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "menu_item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12, 2) NOT NULL,
    "subtotal" DECIMAL(12, 2) NOT NULL,
    "special_requests" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for order_items table
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");
CREATE INDEX "order_items_menu_item_id_idx" ON "order_items"("menu_item_id");

-- Create order_item_modifiers table
CREATE TABLE IF NOT EXISTS "order_item_modifiers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_item_id" UUID NOT NULL,
    "modifier_option_id" UUID NOT NULL,
    "price_adjustment" DECIMAL(12, 2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_item_modifiers_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_item_modifiers_modifier_option_id_fkey" FOREIGN KEY ("modifier_option_id") REFERENCES "modifier_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for order_item_modifiers table
CREATE INDEX "order_item_modifiers_order_item_id_idx" ON "order_item_modifiers"("order_item_id");
CREATE INDEX "order_item_modifiers_modifier_option_id_idx" ON "order_item_modifiers"("modifier_option_id");
