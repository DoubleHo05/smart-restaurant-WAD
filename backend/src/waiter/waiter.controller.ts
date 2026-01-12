import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WaiterService } from './waiter.service';
import { RejectOrderDto } from './dto/reject-order.dto';
import { PendingOrdersFilterDto } from './dto/pending-orders-filter.dto';

/**
 * Waiter Controller
 * Handles waiter-specific order management for multi-restaurant system
 * All endpoints are scoped by restaurant_id to ensure data isolation
 */
@Controller('api/waiter')
// @UseGuards(JwtAuthGuard, RolesGuard) // TODO: Uncomment when auth is implemented
// @Roles('waiter', 'admin') // TODO: Uncomment when auth is implemented
export class WaiterController {
  constructor(private readonly waiterService: WaiterService) {}

  /**
   * GET /api/waiter/pending-orders
   * Get all pending orders for the waiter's restaurant
   * Query params:
   *  - restaurant_id: UUID (required) - The restaurant the waiter works at
   *  - table_id: UUID (optional) - Filter by specific table
   */
  @Get('pending-orders')
  async getPendingOrders(
    @Query('restaurant_id') restaurantId: string,
    @Query('table_id') tableId?: string,
    // @Request() req?, // TODO: Get waiter info from JWT token
  ) {
    if (!restaurantId) {
      return {
        success: false,
        error: 'restaurant_id is required',
      };
    }

    const filters: PendingOrdersFilterDto = {};
    if (tableId) {
      filters.table_id = tableId;
    }

    return this.waiterService.getPendingOrders(restaurantId, filters);
  }

  /**
   * POST /api/orders/:id/accept
   * Waiter accepts a pending order
   * Body: none
   * Query params:
   *  - restaurant_id: UUID (required) - Validates order belongs to this restaurant
   */
  @Post(':id/accept')
  async acceptOrder(
    @Param('id') orderId: string,
    @Query('restaurant_id') restaurantId: string,
    // @Request() req?, // TODO: Get waiter ID from JWT token
  ) {
    if (!restaurantId) {
      return {
        success: false,
        error: 'restaurant_id is required',
      };
    }

    // TODO: Get waiterId from req.user.id
    const waiterId = 'temp-waiter-id'; // Placeholder until auth is implemented

    return this.waiterService.acceptOrder(orderId, restaurantId, waiterId);
  }

  /**
   * POST /api/orders/:id/reject
   * Waiter rejects a pending order with a reason
   * Body: { reason: string }
   * Query params:
   *  - restaurant_id: UUID (required) - Validates order belongs to this restaurant
   */
  @Post(':id/reject')
  async rejectOrder(
    @Param('id') orderId: string,
    @Query('restaurant_id') restaurantId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    rejectDto: RejectOrderDto,
    // @Request() req?, // TODO: Get waiter info from JWT token
  ) {
    if (!restaurantId) {
      return {
        success: false,
        error: 'restaurant_id is required',
      };
    }

    return this.waiterService.rejectOrder(orderId, restaurantId, rejectDto);
  }

  /**
   * POST /api/orders/:id/serve
   * Mark an order as served (food delivered to customer)
   * Body: none
   * Query params:
   *  - restaurant_id: UUID (required) - Validates order belongs to this restaurant
   */
  @Post(':id/serve')
  async serveOrder(
    @Param('id') orderId: string,
    @Query('restaurant_id') restaurantId: string,
    // @Request() req?, // TODO: Get waiter info from JWT token
  ) {
    if (!restaurantId) {
      return {
        success: false,
        error: 'restaurant_id is required',
      };
    }

    // TODO: Get waiterId from req.user.id
    const waiterId = 'temp-waiter-id'; // Placeholder until auth is implemented

    return this.waiterService.serveOrder(orderId, restaurantId, waiterId);
  }

  /**
   * GET /api/waiter/orders
   * Get all orders for the waiter's restaurant with optional filters
   * Query params:
   *  - restaurant_id: UUID (required) - The restaurant the waiter works at
   *  - status: string (optional) - Filter by order status
   *  - table_id: UUID (optional) - Filter by table
   */
  @Get('orders')
  async getRestaurantOrders(
    @Query('restaurant_id') restaurantId: string,
    @Query('status') status?: string,
    @Query('table_id') tableId?: string,
  ) {
    if (!restaurantId) {
      return {
        success: false,
        error: 'restaurant_id is required',
      };
    }

    return this.waiterService.getRestaurantOrders(
      restaurantId,
      status,
      tableId,
    );
  }
}
