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
  BadRequestException,
} from '@nestjs/common';
import { WaiterService } from './waiter.service';
import { RejectOrderDto } from './dto/reject-order.dto';
import { PendingOrdersFilterDto } from './dto/pending-orders-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Waiter Controller
 * Handles waiter-specific order management for multi-restaurant system
 * All endpoints are scoped by restaurant_id to ensure data isolation
 */
@Controller('api/waiter')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('waiter', 'admin', 'super_admin')
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
    @Request() req?: any,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
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
    @Request() req: any,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    const waiterId = req.user.id;

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
    @Request() req: any,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
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
    @Request() req: any,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    const waiterId = req.user.id;

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
      throw new BadRequestException('restaurant_id is required');
    }

    return this.waiterService.getRestaurantOrders(
      restaurantId,
      status,
      tableId,
    );
  }

  /**
   * GET /api/waiter/performance/:waiterId
   * Get waiter performance analytics
   * Query params:
   *  - restaurant_id: UUID (required) - The restaurant for performance tracking
   */
  @Get('performance/:waiterId')
  async getWaiterPerformance(
    @Param('waiterId') waiterId: string,
    @Query('restaurant_id') restaurantId: string,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.waiterService.getWaiterPerformance(waiterId, restaurantId);
  }

  /**
   * GET /api/waiter/leaderboard
   * Get waiter leaderboard for restaurant
   * Query params:
   *  - restaurant_id: UUID (required) - The restaurant for leaderboard
   */
  @Get('leaderboard')
  async getLeaderboard(@Query('restaurant_id') restaurantId: string) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.waiterService.getLeaderboard(restaurantId);
  }
}
