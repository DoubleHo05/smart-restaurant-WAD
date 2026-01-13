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
} from '@nestjs/common';
import type { Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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
}
