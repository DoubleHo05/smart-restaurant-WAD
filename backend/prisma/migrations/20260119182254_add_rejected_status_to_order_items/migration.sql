-- AlterEnum
ALTER TYPE "OrderItemStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "rejection_reason" TEXT;
