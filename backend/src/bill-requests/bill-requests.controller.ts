import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BillRequestsService } from './bill-requests.service';
import { CreateBillRequestDto } from './dto/create-bill-request.dto';
import { AcceptBillRequestDto } from './dto/accept-bill-request.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/bill-requests')
export class BillRequestsController {
  constructor(private readonly billRequestsService: BillRequestsService) {}

  /**
   * POST /api/bill-requests
   * Create a new bill request
   */
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createDto: CreateBillRequestDto,
  ) {
    console.log('📥 [BillRequestsController] Received create request:', {
      table_id: createDto.table_id,
      payment_method_code: createDto.payment_method_code,
      tips_amount: createDto.tips_amount,
      customer_note: createDto.customer_note,
    });
    return this.billRequestsService.create(createDto);
  }

  /**
   * GET /api/bill-requests/:id
   * Get bill request details
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.billRequestsService.findOne(id);
  }

  /**
   * GET /api/bill-requests/table/:tableId/active
   * Get active bill request for a table
   */
  @Get('table/:tableId/active')
  async findActiveByTable(@Param('tableId') tableId: string) {
    return this.billRequestsService.findActiveByTable(tableId);
  }

  /**
   * GET /api/bill-requests/restaurant/:restaurantId
   * Get all bill requests for a restaurant
   */
  @Get('restaurant/:restaurantId')
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.billRequestsService.findByRestaurant(restaurantId);
  }

  /**
   * POST /api/bill-requests/:id/accept
   * Waiter accepts bill request
   */
  @Post(':id/accept')
  async accept(@Param('id') id: string) {
    return this.billRequestsService.accept(id);
  }

  /**
   * POST /api/bill-requests/:id/apply-discount
   * Apply discount to bill request (before accept)
   */
  @Post(':id/apply-discount')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('waiter', 'admin', 'super_admin', 'kitchen')
  async applyDiscount(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    discountDto: ApplyDiscountDto,
    @Request() req: any,
  ) {
    const staffId = req.user.userId;
    return this.billRequestsService.applyDiscount(id, discountDto, staffId);
  }

  /**
   * POST /api/bill-requests/:id/reject
   * Waiter rejects bill request
   */
  @Post(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body() body: { rejection_reason: string },
  ) {
    return this.billRequestsService.reject(id, body.rejection_reason);
  }

  /**
   * PATCH /api/bill-requests/:id/cancel
   * Cancel bill request
   */
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.billRequestsService.cancel(id);
  }

  /**
   * POST /api/bill-requests/:id/complete-cash
   * Waiter confirms cash payment received and completes the bill
   */
  @Post(':id/complete-cash')
  async completeCashPayment(
    @Param('id') id: string,
    @Body() body: { received_amount: number },
  ) {
    return this.billRequestsService.completeCashPayment(id, body.received_amount);
  }
}
