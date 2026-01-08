# Testing Order Status Update API

## Endpoint

`PATCH /api/orders/:id/status`

## Valid Status Transitions

### State Machine Flow

```
pending → accepted → preparing → ready → served → completed
   ↓          ↓          ↓         ↓        ↓
cancelled  cancelled  cancelled  cancelled cancelled

pending → rejected
```

### Transition Rules

| Current Status | Allowed Next Statuses               |
| -------------- | ----------------------------------- |
| `pending`      | `accepted`, `rejected`, `cancelled` |
| `accepted`     | `preparing`, `cancelled`            |
| `preparing`    | `ready`, `cancelled`                |
| `ready`        | `served`, `cancelled`               |
| `served`       | `completed`, `cancelled`            |
| `completed`    | ❌ Terminal state                   |
| `cancelled`    | ❌ Terminal state                   |
| `rejected`     | ❌ Terminal state                   |

## Request Format

### Headers

```
Content-Type: application/json
```

### Body

```json
{
  "status": "accepted",
  "reason": "Optional reason for rejection/cancellation"
}
```

### Valid Status Values

- `pending`
- `accepted`
- `preparing`
- `ready`
- `served`
- `completed`
- `cancelled`
- `rejected`

## Test Scenarios

### ✅ Scenario 1: Accept Pending Order (Waiter)

```powershell
# Get a pending order first
$order = Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method Get | Select-Object -First 1

# Accept the order
$body = @{
    status = "accepted"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$($order.id)/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
```

**Expected Response:**

```json
{
  "message": "Order status updated from \"pending\" to \"accepted\"",
  "order": {
    "id": "...",
    "order_number": "ORD-20260108-0001",
    "status": "accepted",
    "accepted_at": "2026-01-08T10:30:00.000Z",
    "table": { ... },
    "order_items": [ ... ]
  }
}
```

### ✅ Scenario 2: Kitchen Starts Preparing

```powershell
$body = @{
    status = "preparing"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
```

### ✅ Scenario 3: Mark Food Ready

```powershell
$body = @{
    status = "ready"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
```

### ✅ Scenario 4: Waiter Serves Food

```powershell
$body = @{
    status = "served"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
```

### ✅ Scenario 5: Complete Order (After Payment)

```powershell
$body = @{
    status = "completed"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
```

### ✅ Scenario 6: Reject Pending Order (Waiter)

```powershell
$body = @{
    status = "rejected"
    reason = "Items not available"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
```

### ✅ Scenario 7: Cancel Order (Customer/Waiter)

```powershell
$body = @{
    status = "cancelled"
    reason = "Customer changed mind"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
```

### ❌ Scenario 8: Invalid Transition (Should Fail)

```powershell
# Try to jump from pending to ready (invalid)
$body = @{
    status = "ready"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
```

**Expected Error:**

```json
{
  "statusCode": 400,
  "message": "Invalid status transition from \"pending\" to \"ready\"",
  "error": "Bad Request"
}
```

### ❌ Scenario 9: Update Completed Order (Should Fail)

```powershell
# Try to change completed order
$body = @{
    status = "cancelled"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$completedOrderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
```

**Expected Error:**

```json
{
  "statusCode": 400,
  "message": "Invalid status transition from \"completed\" to \"cancelled\"",
  "error": "Bad Request"
}
```

## Complete Test Flow (PowerShell)

```powershell
# 1. Create a test order first (see TEST_ORDER_API.md)
# Assume we have $orderId from order creation

# 2. Accept order (Waiter)
Write-Host "Step 1: Accepting order..." -ForegroundColor Cyan
$body = @{ status = "accepted" } | ConvertTo-Json
$result = Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
Write-Host "✓ Order accepted" -ForegroundColor Green
Write-Host "  accepted_at: $($result.order.accepted_at)"

# 3. Start preparing (Kitchen)
Write-Host "`nStep 2: Kitchen starts preparing..." -ForegroundColor Cyan
$body = @{ status = "preparing" } | ConvertTo-Json
$result = Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
Write-Host "✓ Preparing started" -ForegroundColor Green
Write-Host "  preparing_at: $($result.order.preparing_at)"

# 4. Mark ready (Kitchen)
Write-Host "`nStep 3: Marking food as ready..." -ForegroundColor Cyan
$body = @{ status = "ready" } | ConvertTo-Json
$result = Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
Write-Host "✓ Food is ready" -ForegroundColor Green
Write-Host "  ready_at: $($result.order.ready_at)"

# 5. Serve food (Waiter)
Write-Host "`nStep 4: Serving food to customer..." -ForegroundColor Cyan
$body = @{ status = "served" } | ConvertTo-Json
$result = Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
Write-Host "✓ Food served" -ForegroundColor Green
Write-Host "  served_at: $($result.order.served_at)"

# 6. Complete order (After payment)
Write-Host "`nStep 5: Completing order..." -ForegroundColor Cyan
$body = @{ status = "completed" } | ConvertTo-Json
$result = Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId/status" -Method Patch -Headers @{"Content-Type"="application/json"} -Body $body
Write-Host "✓ Order completed" -ForegroundColor Green
Write-Host "  completed_at: $($result.order.completed_at)"

Write-Host "`n✅ Complete order flow tested successfully!" -ForegroundColor Green
```

## Timestamp Fields Updated

The API automatically sets timestamp fields based on status:

| New Status  | Timestamp Field Set |
| ----------- | ------------------- |
| `accepted`  | `accepted_at`       |
| `preparing` | `preparing_at`      |
| `ready`     | `ready_at`          |
| `served`    | `served_at`         |
| `completed` | `completed_at`      |

## Real-time Notifications (Sprint 2)

The service includes a placeholder for Socket.IO notifications:

```typescript
// TODO: Emit Socket.IO event for real-time notification (Sprint 2)
// this.notificationGateway.emitOrderStatusUpdate({
//   orderId: order.id,
//   orderNumber: order.order_number,
//   tableId: order.table_id,
//   oldStatus: order.status,
//   newStatus: updateDto.status,
//   reason: updateDto.reason,
// });
```

This will be implemented in Sprint 2 when Socket.IO integration is added.

## Error Handling

### 404 - Order Not Found

```json
{
  "statusCode": 404,
  "message": "Order with ID {id} not found",
  "error": "Not Found"
}
```

### 400 - Invalid Status Transition

```json
{
  "statusCode": 400,
  "message": "Invalid status transition from \"{current}\" to \"{new}\"",
  "error": "Bad Request"
}
```

### 400 - Invalid Status Value

```json
{
  "statusCode": 400,
  "message": "status must be a valid enum value",
  "error": "Bad Request"
}
```

## Task Completion Checklist

- [x] Create `UpdateOrderStatusDto` with validation
- [x] Implement status transition validation logic
- [x] Add `updateStatus()` method to service
- [x] Add `PATCH /api/orders/:id/status` endpoint
- [x] Set appropriate timestamp fields
- [x] Prepare for Socket.IO notifications (Sprint 2)
- [x] Error handling for invalid transitions
- [x] Documentation and test scenarios

## Next Steps (Sprint 2)

1. Implement Socket.IO gateway for real-time notifications
2. Emit events on status changes:
   - Notify waiters when new order is placed
   - Notify kitchen when order is accepted
   - Notify waiter when food is ready
   - Notify customer on all status updates
3. Add role-based access control (only waiters can accept, only kitchen can mark ready, etc.)
