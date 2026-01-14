import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ValidationPipe,
  Headers,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddItemsToOrderDto } from './dto/add-items-to-order.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /api/orders
   * Create a new order from cart
   * Accepts x-session-id header for guest orders
   */
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createDto: CreateOrderDto,
    @Headers('x-session-id') sessionId?: string,
  ) {
    // Add session_id from header if not already in DTO
    if (sessionId && !createDto.session_id) {
      createDto.session_id = sessionId;
    }
    return this.ordersService.create(createDto);
  }

  /**
   * GET /api/orders
   * List all orders with optional filters (Admin/Waiter)
   * Query params: status, restaurant_id, start_date, end_date
   */
  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('restaurant_id') restaurant_id?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    const filters: any = {};

    if (status) {
      filters.status = status;
    }

    if (restaurant_id) {
      filters.restaurant_id = restaurant_id;
    }

    if (start_date) {
      filters.start_date = new Date(start_date);
    }

    if (end_date) {
      filters.end_date = new Date(end_date);
    }

    return this.ordersService.findAll(filters);
  }

  /**
   * GET /api/orders/my-orders
   * Get current user's active orders (customer view)
   * Uses customer_id from auth or session_id from header
   * Query params: customer_id (optional for auth), status
   */
  @Get('my-orders')
  async getMyOrders(
    @Query('customer_id') customerId?: string,
    @Query('status') status?: string,
    @Headers('x-session-id') sessionId?: string,
  ) {
    // Filter for active orders (not completed/cancelled)
    const activeStatuses = ['pending', 'accepted', 'preparing', 'ready', 'served'];
    const orderStatus = status || activeStatuses;

    if (customerId) {
      return this.ordersService.findByCustomerId(customerId, { 
        status: orderStatus 
      });
    }
    
    // For guest orders, could implement session-based tracking in future
    return [];
  }

  /**
   * GET /api/orders/:id
   * Get order details
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.getOrderDetails(id);
  }

  /**
   * GET /api/orders/table/:tableId
   * Get orders by table ID
   */
  @Get('table/:tableId')
  async findByTable(@Param('tableId') tableId: string) {
    return this.ordersService.findByTableId(tableId);
  }

  /**
   * GET /api/orders/customer/:customerId
   * Get customer order history with optional filters
   * Query params: status, restaurant_id, start_date, end_date
   */
  @Get('customer/:customerId')
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query('status') status?: string,
    @Query('restaurant_id') restaurant_id?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (restaurant_id) filters.restaurant_id = restaurant_id;
    if (start_date) filters.start_date = new Date(start_date);
    if (end_date) filters.end_date = new Date(end_date);
    
    return this.ordersService.findByCustomerId(customerId, filters);
  }

  /**
   * PATCH /api/orders/:id/status
   * Update order status with validation
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateDto);
  }

  /**
   * POST /api/orders/:id/add-items
   * Add items to an existing open order
   * Recalculates totals and notifies waiter
   */
  @Post(':id/add-items')
  async addItems(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    addItemsDto: AddItemsToOrderDto,
  ) {
    return this.ordersService.addItemsToOrder(id, addItemsDto.items);
  }

  /**
   * GET /api/orders/:id/status
   * Get current order status and timeline
   * For real-time tracking by customers
   */
  @Get(':id/status')
  async getOrderStatus(@Param('id') id: string) {
    const order = await this.ordersService.getOrderDetails(id);
    
    return {
      order_id: order.id,
      order_number: order.order_number,
      status: order.status,
      timeline: {
        created_at: order.created_at,
        accepted_at: order.accepted_at,
        preparing_at: order.preparing_at,
        ready_at: order.ready_at,
        served_at: order.served_at,
        completed_at: order.completed_at,
      },
      estimated_time: this.calculateEstimatedTime(order),
    };
  }

  private calculateEstimatedTime(order: any): string | null {
    if (order.status === 'completed' || order.status === 'cancelled') {
      return null;
    }
    
    // Simple estimation based on order items
    const totalPrepTime = order.order_items.reduce((sum: number, item: any) => {
      return sum + (item.menu_item.prep_time_minutes || 15) * item.quantity;
    }, 0);
    
    return `${Math.max(totalPrepTime, 15)} minutes`;
  }
}
