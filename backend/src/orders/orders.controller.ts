import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
}
