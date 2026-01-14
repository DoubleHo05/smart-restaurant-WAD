import {
  Controller,
  Post,
  Body,
  Query,
  Req,
  Get,
  Res,
  HttpStatus,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MoMoCallbackDto } from './dto/momo-callback.dto';
import { ZaloPayCallbackDto } from './dto/zalopay-callback.dto';
import { VNPayIPNDto } from './dto/vnpay-ipn.dto';
import { CashConfirmDto } from './dto/cash-confirm.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * MoMo IPN Callback
   * Webhook từ MoMo khi payment thành công/thất bại
   */
  @Post('momo/callback')
  @ApiOperation({ summary: 'MoMo IPN callback endpoint' })
  @ApiResponse({ status: 200, description: 'Callback processed successfully' })
  async handleMoMoCallback(
    @Body() body: MoMoCallbackDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.paymentsService.handleMoMoCallback(body);
      return res.status(HttpStatus.OK).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  /**
   * ZaloPay Callback
   * Webhook từ ZaloPay khi payment thành công/thất bại
   */
  @Post('zalopay/callback')
  @ApiOperation({ summary: 'ZaloPay callback endpoint' })
  @ApiResponse({ status: 200, description: 'Callback processed successfully' })
  async handleZaloPayCallback(
    @Body() body: ZaloPayCallbackDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.paymentsService.handleZaloPayCallback(body);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.OK).json({
        return_code: 0,
        return_message: error.message,
      });
    }
  }

  /**
   * VNPay IPN (Instant Payment Notification)
   * Webhook từ VNPay khi payment thành công/thất bại
   */
  @Get('vnpay/ipn')
  @ApiOperation({ summary: 'VNPay IPN endpoint' })
  @ApiResponse({ status: 200, description: 'IPN processed successfully' })
  async handleVNPayIPN(@Query() query: any) {
    console.log('🔔 [VNPay IPN] Received callback from VNPay');
    console.log('📦 Query params:', JSON.stringify(query, null, 2));

    try {
      const result = await this.paymentsService.handleVNPayIPN(query);
      console.log('✅ [VNPay IPN] Processed successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ [VNPay IPN] Error:', error.message);
      console.error('📍 Stack:', error.stack);
      return {
        RspCode: '99',
        Message: error.message,
      };
    }
  }

  /**
   * VNPay Return URL Handler
   * Frontend gọi endpoint này để verify và update payment
   * (VNPay sandbox không gọi IPN, nên dùng Return URL)
   */
  @Get('vnpay/return')
  @ApiOperation({ summary: 'VNPay return URL verification' })
  @ApiResponse({ status: 200, description: 'Payment verified' })
  async handleVNPayReturn(@Query() query: any) {
    console.log('🔔 [VNPay Return] Verifying payment result');
    console.log('📦 Query params:', JSON.stringify(query, null, 2));

    try {
      const result = await this.paymentsService.handleVNPayIPN(query);
      console.log('✅ [VNPay Return] Processed:', result);
      return {
        success: result.RspCode === '00',
        ...result,
        payment_id: query.vnp_TxnRef,
        amount: parseInt(query.vnp_Amount) / 100,
        response_code: query.vnp_ResponseCode,
        transaction_no: query.vnp_TransactionNo,
      };
    } catch (error) {
      console.error('❌ [VNPay Return] Error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Confirm Cash Payment
   * Waiter xác nhận đã nhận tiền mặt từ khách
   */
  @Post('cash/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('waiter', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Waiter confirms cash payment received' })
  @ApiResponse({ status: 200, description: 'Cash payment confirmed' })
  async confirmCashPayment(@Body() dto: CashConfirmDto, @Req() req: Request) {
    // Override waiter_id with authenticated user
    const payload = {
      payment_id: dto.payment_id,
      received_amount: dto.received_amount,
      waiter_id: (req as any).user?.userId || dto.waiter_id,
    };
    return this.paymentsService.confirmCashPayment(payload);
  }

  /**
   * List payments with filters (Admin only)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all payments with filters (Admin)' })
  @ApiResponse({ status: 200, description: 'Payments list retrieved' })
  async listPayments(@Query() dto: ListPaymentsDto) {
    return this.paymentsService.listPayments(dto);
  }

  /**
   * Get payment detail by ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details by ID' })
  @ApiResponse({ status: 200, description: 'Payment details retrieved' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentDetail(@Param('id') id: string) {
    return this.paymentsService.getPaymentDetail(id);
  }

  /**
   * Analytics: Revenue by payment method
   */
  @Get('analytics/revenue-by-method')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get revenue breakdown by payment method' })
  @ApiResponse({ status: 200, description: 'Revenue analytics retrieved' })
  async getRevenueByMethod(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.paymentsService.getRevenueByMethod(startDate, endDate);
  }

  /**
   * Analytics: Success rate by payment method
   */
  @Get('analytics/success-rate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get success rate by payment method' })
  @ApiResponse({ status: 200, description: 'Success rate analytics retrieved' })
  async getSuccessRate() {
    return this.paymentsService.getSuccessRateByMethod();
  }
}
