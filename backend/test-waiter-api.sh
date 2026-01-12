#!/bin/bash

# Waiter API Test Script
# Tests all waiter endpoints with multi-restaurant support
# Make sure backend is running on http://localhost:3000

BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "  WAITER API TESTING SCRIPT"
echo "  Multi-Restaurant Support"
echo "======================================"
echo ""

# These should be replaced with actual UUIDs from your database
RESTAURANT_ID="550e8400-e29b-41d4-a716-446655440000" # Replace with actual restaurant ID
TABLE_ID="660e8400-e29b-41d4-a716-446655440001"      # Replace with actual table ID
ORDER_ID=""                                           # Will be set after creating an order

echo -e "${YELLOW}Step 1: Get Pending Orders${NC}"
echo "GET $BASE_URL/waiter/pending-orders?restaurant_id=$RESTAURANT_ID"
curl -X GET "$BASE_URL/waiter/pending-orders?restaurant_id=$RESTAURANT_ID" \
  -H "Content-Type: application/json" \
  | json_pp
echo ""
echo ""

echo -e "${YELLOW}Step 2: Get Pending Orders Filtered by Table${NC}"
echo "GET $BASE_URL/waiter/pending-orders?restaurant_id=$RESTAURANT_ID&table_id=$TABLE_ID"
curl -X GET "$BASE_URL/waiter/pending-orders?restaurant_id=$RESTAURANT_ID&table_id=$TABLE_ID" \
  -H "Content-Type: application/json" \
  | json_pp
echo ""
echo ""

# Note: You need to create an order first or use an existing pending order ID
echo -e "${YELLOW}Step 3: Accept an Order${NC}"
echo "POST $BASE_URL/waiter/{ORDER_ID}/accept?restaurant_id=$RESTAURANT_ID"
echo -e "${RED}[SKIPPED] - Please replace {ORDER_ID} with an actual pending order ID${NC}"
# Uncomment and replace ORDER_ID when you have a pending order:
# curl -X POST "$BASE_URL/waiter/$ORDER_ID/accept?restaurant_id=$RESTAURANT_ID" \
#   -H "Content-Type: application/json" \
#   | json_pp
echo ""
echo ""

echo -e "${YELLOW}Step 4: Reject an Order with Reason${NC}"
echo "POST $BASE_URL/waiter/{ORDER_ID}/reject?restaurant_id=$RESTAURANT_ID"
echo -e "${RED}[SKIPPED] - Please replace {ORDER_ID} with an actual pending order ID${NC}"
# Uncomment and replace ORDER_ID when you have a pending order:
# curl -X POST "$BASE_URL/waiter/$ORDER_ID/reject?restaurant_id=$RESTAURANT_ID" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "reason": "Item is sold out"
#   }' \
#   | json_pp
echo ""
echo ""

echo -e "${YELLOW}Step 5: Mark Order as Served${NC}"
echo "POST $BASE_URL/waiter/{ORDER_ID}/serve?restaurant_id=$RESTAURANT_ID"
echo -e "${RED}[SKIPPED] - Please replace {ORDER_ID} with an actual 'ready' status order ID${NC}"
# Uncomment and replace ORDER_ID when you have a ready order:
# curl -X POST "$BASE_URL/waiter/$ORDER_ID/serve?restaurant_id=$RESTAURANT_ID" \
#   -H "Content-Type: application/json" \
#   | json_pp
echo ""
echo ""

echo -e "${YELLOW}Step 6: Get All Restaurant Orders${NC}"
echo "GET $BASE_URL/waiter/orders?restaurant_id=$RESTAURANT_ID"
curl -X GET "$BASE_URL/waiter/orders?restaurant_id=$RESTAURANT_ID" \
  -H "Content-Type: application/json" \
  | json_pp
echo ""
echo ""

echo -e "${YELLOW}Step 7: Get Orders by Status${NC}"
echo "GET $BASE_URL/waiter/orders?restaurant_id=$RESTAURANT_ID&status=accepted"
curl -X GET "$BASE_URL/waiter/orders?restaurant_id=$RESTAURANT_ID&status=accepted" \
  -H "Content-Type: application/json" \
  | json_pp
echo ""
echo ""

echo -e "${YELLOW}Step 8: Test Restaurant Isolation (Should Fail)${NC}"
echo "Trying to access orders from different restaurant..."
WRONG_RESTAURANT_ID="770e8400-e29b-41d4-a716-446655440099"
echo "GET $BASE_URL/waiter/pending-orders?restaurant_id=$WRONG_RESTAURANT_ID"
curl -X GET "$BASE_URL/waiter/pending-orders?restaurant_id=$WRONG_RESTAURANT_ID" \
  -H "Content-Type: application/json" \
  | json_pp
echo ""
echo ""

echo -e "${GREEN}======================================"
echo "  TEST COMPLETED"
echo "======================================${NC}"
echo ""
echo "NOTES:"
echo "1. Replace RESTAURANT_ID, TABLE_ID, and ORDER_ID with actual values from your database"
echo "2. Create test data using the orders API first"
echo "3. Test order state transitions: pending → accepted → ready → served"
echo "4. Verify restaurant isolation by trying to access orders with wrong restaurant_id"
echo ""
