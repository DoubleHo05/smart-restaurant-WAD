import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ValidationPipe,
  Res,
  Header,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  /**
   * POST /api/orders
   * Create a new order from cart
   */
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createDto: CreateOrderDto,
  ) {
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
   * GET /api/orders/history
   * Get completed orders with filters (date, customer, table)
   * Query params: restaurant_id, customer_id, table_id, start_date, end_date, export (csv)
   */
  @Get('history')
  async getHistory(
    @Query('restaurant_id') restaurant_id?: string,
    @Query('customer_id') customer_id?: string,
    @Query('table_id') table_id?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('export') exportFormat?: string,
    @Res({ passthrough: false }) res?: Response,
  ) {
    const filters: any = {
      restaurant_id,
      customer_id,
      table_id,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
    };

    // If export=csv, return CSV file
    if (exportFormat === 'csv' && res) {
      const csv = await this.ordersService.exportHistoryToCSV(filters);
      res.header('Content-Type', 'text/csv');
      res.header(
        'Content-Disposition',
        `attachment; filename="orders-history-${new Date().toISOString().split('T')[0]}.csv"`,
      );
      return res.send(csv);
    }

    // Otherwise return JSON
    return this.ordersService.getOrderHistory(filters);
  }

  /**
   * GET /api/orders/my-orders
   * Get order history for logged-in customer (requires authentication)
   */
  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(
    @Req() req: Request,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('date') date?: string,
  ) {
    console.log('📋 [OrdersController] /my-orders endpoint hit');
    console.log('🔑 [OrdersController] Request user:', (req as any).user);
    console.log('📊 [OrdersController] Query params:', { status, limit, date });

    const userId = (req as any).user?.userId;

    console.log('👤 [OrdersController] Extracted userId:', userId);

    if (!userId) {
      console.error('❌ [OrdersController] No userId found in request');
      throw new Error('User not authenticated');
    }

    console.log('🔍 [OrdersController] Fetching orders for customer:', userId);

    const result = await this.ordersService.findByCustomerId(userId);
    let orders = result.data || [];

    // Ensure orders is an array
    if (!Array.isArray(orders)) {
      orders = [];
    }

    console.log('📦 [OrdersController] Found orders:', {
      total: orders.length,
      statuses: orders.map((o: any) => o.status),
    });

    // Apply status filter if specified
    if (status) {
      orders = orders.filter((order: any) => order.status === status);
      console.log('🔽 [OrdersController] After status filter:', {
        status,
        filtered: orders.length,
      });
    }

    // Apply date filter if specified
    if (date) {
      // date is "YYYY-MM-DD"
      const filterDate = date;

      orders = orders.filter((order: any) => {
        if (!order.created_at) return false;

        // Convert UTC created_at to Vietnam Time (UTC+7)
        const orderUtcDate = new Date(order.created_at);
        const vnTime = new Date(orderUtcDate.getTime() + 7 * 60 * 60 * 1000);
        const vnDateString = vnTime.toISOString().split('T')[0];

        return vnDateString === filterDate;
      });

      console.log('📅 [OrdersController] After date filter (Vietnam Time):', {
        date: filterDate,
        filtered: orders.length,
      });
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10);
      orders = orders.slice(0, limitNum);
      console.log('🔢 [OrdersController] After limit:', {
        limit: limitNum,
        remaining: orders.length,
      });
    }

    console.log('✅ [OrdersController] Returning orders:', orders.length);

    return {
      data: orders,
      total: orders.length,
    };
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
   * Get customer order history
   */
  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: string) {
    return this.ordersService.findByCustomerId(customerId);
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
   * POST /api/orders/:id/complete
   * Complete an order (verify payment, release table, archive)
   */
  @Post(':id/complete')
  async completeOrder(@Param('id') id: string) {
    return this.ordersService.completeOrder(id);
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
    addItemsDto: any, // You can create AddItemsToOrderDto
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
    };
  }

  /**
   * PATCH /api/orders/:orderId/items/:itemId/status
   * Update individual order item status (Kitchen)
   * Auto-updates order status based on all items
   */
  @Patch(':orderId/items/:itemId/status')
  async updateItemStatus(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() body: { status: 'QUEUED' | 'COOKING' | 'READY' },
  ) {
    return this.ordersService.updateItemStatus(orderId, itemId, body.status);
  }

  /**
   * POST /api/orders/:orderId/items/:itemId/reject
   * Reject an individual order item (Waiter)
   * Updates order total and notifies customer
   */
  @Post(':orderId/items/:itemId/reject')
  async rejectItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() body: { reason?: string },
  ) {
    return this.ordersService.rejectOrderItem(orderId, itemId, body.reason);
  }
}
