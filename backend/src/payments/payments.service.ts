import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MomoService } from './momo/momo.service';
import { ZaloPayService } from './zalopay/zalopay.service';
import { VnPayService } from './vnpay/vnpay.service';
import { CashService } from './cash/cash.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { ListPaymentsDto } from './dto/list-payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly momoService: MomoService,
    private readonly zaloPayService: ZaloPayService,
    private readonly vnpayService: VnPayService,
    private readonly cashService: CashService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Khởi tạo payment từ bill request (được gọi khi waiter accept)
   */
  async initiatePaymentFromBillRequest(dto: {
    bill_request_id: string;
    payment_method: string;
    amount: number;
    tips_amount: number;
    order_ids: string[];
    restaurant_id: string;
  }) {
    const {
      bill_request_id,
      payment_method,
      amount,
      tips_amount,
      order_ids,
      restaurant_id,
    } = dto;

    // 1. Validate bill request
    const billRequest = await this.prisma.billRequest.findUnique({
      where: { id: bill_request_id },
    });

    if (!billRequest) {
      throw new NotFoundException('Bill request not found');
    }

    if (billRequest.status !== 'accepted') {
      throw new BadRequestException(
        'Bill request must be accepted before payment',
      );
    }

    // 2. Lấy payment method từ DB (dùng code, không có restaurant_id)
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        code: payment_method.toLowerCase(),
        is_active: true,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException(
        `Payment method ${payment_method} not found or inactive`,
      );
    }

    const totalAmount = amount + tips_amount;

    // 3. Tạo payment record (dùng đúng column names từ schema)
    const payment = await this.prisma.payment.create({
      data: {
        bill_request_id,
        payment_method_id: paymentMethod.id,
        amount: totalAmount,
        tips_amount,
        merged_order_ids: order_ids,
        status: 'pending',
      },
    });

    // 4. Gọi gateway service tương ứng
    let gatewayResponse;

    switch (payment_method.toLowerCase()) {
      case 'momo':
        gatewayResponse = await this.momoService.createPayment({
          payment_id: payment.id,
          amount: totalAmount,
          order_info: `Payment for ${order_ids.length} orders`,
          restaurant_id,
        });
        break;

      case 'zalopay':
        gatewayResponse = await this.zaloPayService.createOrder({
          payment_id: payment.id,
          amount: totalAmount,
          description: `Bill payment - ${order_ids.length} orders`,
          restaurant_id,
        });
        break;

      case 'vnpay':
        gatewayResponse = await this.vnpayService.createPaymentUrl({
          payment_id: payment.id,
          amount: totalAmount,
          order_info: `Bill ${bill_request_id}`,
          restaurant_id,
        });
        break;

      case 'cash':
        gatewayResponse = await this.cashService.createCashPayment({
          payment_id: payment.id,
          amount: totalAmount,
        });
        break;

      default:
        throw new BadRequestException(
          `Unsupported payment method: ${payment_method}`,
        );
    }

    // 5. Update payment với gateway info
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        gateway_request_id: gatewayResponse.transaction_id,
      },
    });

    return {
      payment_id: payment.id,
      transaction_id: gatewayResponse.transaction_id,
      qr_code: gatewayResponse.qr_code,
      payment_url: gatewayResponse.payment_url,
    };
  }
  async handleMoMoCallback(data: {
    orderId: string;
    requestId: string;
    amount: number;
    orderInfo: string;
    orderType: string;
    transId: string;
    resultCode: number;
    message: string;
    payType: string;
    responseTime: number;
    extraData: string;
    signature: string;
  }) {
    // 1. Verify signature
    const isValid = this.momoService.verifySignature(data);
    if (!isValid) {
      throw new BadRequestException('Invalid MoMo signature');
    }

    // 2. Tìm payment (orderId chính là payment_id)
    const payment = await this.prisma.payment.findUnique({
      where: { id: data.orderId },
      include: { bill_requests: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // 3. Update payment status
    const status = data.resultCode === 0 ? 'completed' : 'failed';

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        gateway_trans_id: data.transId.toString(),
        completed_at: status === 'completed' ? new Date() : null,
        failed_reason: status === 'failed' ? data.message : null,
      },
    });

    // 4. Nếu thành công, complete bill
    if (status === 'completed' && payment.bill_request_id) {
      await this.completeBillPayment(payment.bill_request_id);
    }

    return { status, payment_id: payment.id };
  }

  async handleZaloPayCallback(data: {
    app_id: string;
    app_trans_id: string;
    app_time: number;
    app_user: string;
    amount: number;
    embed_data: string;
    item: string;
    zp_trans_id: string;
    server_time: number;
    channel: number;
    merchant_user_id: string;
    user_fee_amount: number;
    discount_amount: number;
    status: number;
    mac: string;
  }) {
    // 1. Verify MAC
    const isValid = this.zaloPayService.verifyMAC(data);
    if (!isValid) {
      throw new BadRequestException('Invalid ZaloPay MAC');
    }

    // 2. Parse embed_data để lấy payment_id
    const embedData = JSON.parse(data.embed_data);
    const payment = await this.prisma.payment.findUnique({
      where: { id: embedData.payment_id },
      include: { bill_requests: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // 3. Update payment status (dùng đúng column names)
    const status = data.status === 1 ? 'completed' : 'failed';

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        gateway_trans_id: data.zp_trans_id.toString(),
        completed_at: status === 'completed' ? new Date() : null,
        failed_reason: status === 'failed' ? 'Payment failed' : null,
      },
    });

    // 4. Nếu thành công, complete bill
    if (status === 'completed' && payment.bill_request_id) {
      await this.completeBillPayment(payment.bill_request_id);
    }

    return { return_code: 1, return_message: 'success' };
  }

  /**
   * Helper: Complete bill payment - update orders và bill_request
   */
  private async completeBillPayment(bill_request_id: string) {
    console.log('📋 [Complete Bill] Starting for bill:', bill_request_id);
    
    const billRequest = await this.prisma.billRequest.findUnique({
      where: { id: bill_request_id },
    });

    if (!billRequest) {
      console.error('❌ Bill request not found:', bill_request_id);
      throw new NotFoundException('Bill request not found');
    }

    console.log('📦 Bill request found:', {
      id: billRequest.id,
      status: billRequest.status,
      orderIds: billRequest.order_ids,
    });

    // Lấy order IDs từ merged_order_ids hoặc bill_request
    const orderIds = billRequest.order_ids as string[];
    console.log('🛒 Updating orders:', orderIds);

    // Update tất cả orders sang 'completed'
    const updatedOrders = await this.prisma.order.updateMany({
      where: {
        id: { in: orderIds },
      },
      data: {
        status: 'completed',
      },
    });

    console.log('✅ Orders updated:', updatedOrders.count, 'orders');

    // Update bill_request sang 'completed'
    await this.prisma.billRequest.update({
      where: { id: bill_request_id },
      data: {
        status: 'completed',
      },
    });

    console.log('✅ Bill request completed:', bill_request_id);

    // Phase 4: Emit socket event 'bill-paid'
    try {
      // Lấy payment info để emit
      const payment = await this.prisma.payment.findFirst({
        where: { bill_request_id },
        include: {
          bill_requests: {
            include: {
              tables: true,
            },
          },
        },
      });

      if (payment) {
        await this.notificationsGateway.notifyPaymentCompleted(
          payment,
          payment.bill_requests,
        );
      }
    } catch (error) {
      console.error('❌ Failed to emit payment notification:', error.message);
    }

    return { success: true };
  }

  async handleVNPayIPN(query: any) {
    console.log('🔍 [VNPay IPN Handler] Starting...');
    console.log('📦 Received query:', JSON.stringify(query, null, 2));
    
    // 1. Verify signature
    const isValid = this.vnpayService.verifySignature(query);
    console.log('🔐 Signature valid:', isValid);
    
    if (!isValid) {
      console.error('❌ Invalid signature');
      return { RspCode: '97', Message: 'Invalid signature' };
    }

    // 2. Lấy payment_id từ vnp_TxnRef
    const payment_id = query.vnp_TxnRef;
    console.log('🔑 Payment ID:', payment_id);
    
    const payment = await this.prisma.payment.findUnique({
      where: { id: payment_id },
      include: { bill_requests: true },
    });

    if (!payment) {
      console.error('❌ Payment not found:', payment_id);
      return { RspCode: '01', Message: 'Order not found' };
    }

    console.log('💰 Payment found:', {
      id: payment.id,
      amount: payment.amount.toNumber(),
      status: payment.status,
      bill_request_id: payment.bill_request_id,
    });

    // 3. Kiểm tra amount (convert Decimal to number)
    const vnp_Amount = parseInt(query.vnp_Amount) / 100;
    const paymentAmount = payment.amount.toNumber();
    
    // So sánh với tolerance 1 VND do rounding
    const amountDiff = Math.abs(vnp_Amount - paymentAmount);
    
    console.log('💵 Amount check:', {
      vnpAmount: vnp_Amount,
      paymentAmount: paymentAmount,
      difference: amountDiff,
      withinTolerance: amountDiff < 1,
    });
    
    if (amountDiff >= 1) {
      console.error('❌ Amount mismatch (difference >= 1 VND)');
      return { RspCode: '04', Message: 'Invalid amount' };
    }

    // 4. Update payment status (dùng đúng column names)
    const responseCode = query.vnp_ResponseCode;
    const status = responseCode === '00' ? 'completed' : 'failed';
    
    console.log('📝 Updating payment:', {
      responseCode,
      status,
      transactionNo: query.vnp_TransactionNo,
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        gateway_trans_id: query.vnp_TransactionNo,
        completed_at: status === 'completed' ? new Date() : null,
        failed_reason: status === 'failed' ? query.vnp_Message : null,
      },
    });

    console.log('✅ Payment updated to:', status);

    // 5. Nếu thành công, complete bill
    if (status === 'completed' && payment.bill_request_id) {
      console.log('🔄 Completing bill request:', payment.bill_request_id);
      await this.completeBillPayment(payment.bill_request_id);
      console.log('✅ Bill request completed');
    }

    console.log('🎉 VNPay IPN processed successfully');
    return { RspCode: '00', Message: 'Confirm Success' };
  }

  async confirmCashPayment(dto: {
    payment_id: string;
    received_amount: number;
    waiter_id: string;
  }) {
    const { payment_id, received_amount, waiter_id } = dto;

    const payment = await this.prisma.payment.findUnique({
      where: { id: payment_id },
      include: { bill_requests: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (received_amount < payment.amount.toNumber()) {
      throw new BadRequestException(
        'Received amount is less than total amount',
      );
    }

    const change = received_amount - payment.amount.toNumber();

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        completed_at: new Date(),
        gateway_trans_id: `CASH-${Date.now()}`,
      },
    });

    if (payment.bill_request_id) {
      await this.completeBillPayment(payment.bill_request_id);
    }

    return {
      payment_id,
      change_amount: change,
      message: 'Cash payment confirmed',
    };
  }

  /**
   * List payments with filters (Admin only)
   */
  async listPayments(dto: ListPaymentsDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      method,
      start_date,
      end_date,
      restaurant_id,
    } = dto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      // Only search on text fields (not UUID)
      where.OR = [
        {
          gateway_trans_id: {
            contains: search,
            mode: 'insensitive' as any,
          },
        },
        {
          gateway_request_id: {
            contains: search,
            mode: 'insensitive' as any,
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (method) {
      where.payment_methods = {
        code: method,
      };
    }

    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) {
        where.created_at.gte = new Date(start_date);
      }
      if (end_date) {
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.created_at.lte = endDateTime;
      }
    }

    // Query
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          payment_methods: {
            select: {
              code: true,
              name: true,
              logo_url: true,
            },
          },
          bill_requests: {
            select: {
              id: true,
              table_id: true,
              total_amount: true,
              status: true,
              tables: {
                select: {
                  table_number: true,
                },
              },
            },
          },
          users_payments_received_byTousers: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get payment details
   */
  async getPaymentDetail(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        payment_methods: {
          select: {
            code: true,
            name: true,
            logo_url: true,
            description: true,
          },
        },
        bill_requests: {
          include: {
            tables: {
              select: {
                table_number: true,
                id: true,
              },
            },
          },
        },
        users_payments_received_byTousers: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Get all orders from bill_request's order_ids
    if (payment.bill_requests?.order_ids) {
      const orderIds = payment.bill_requests.order_ids as string[];
      const orders = await this.prisma.order.findMany({
        where: {
          id: { in: orderIds },
        },
        include: {
          order_items: {
            include: {
              menu_item: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      return {
        ...payment,
        orders,
      };
    }

    return payment;
  }

  /**
   * Analytics: Revenue by payment method
   */
  async getRevenueByMethod(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'completed',
        completed_at: {
          gte: start,
          lte: end,
        },
      },
      include: {
        payment_methods: true,
      },
    });

    // Group by method
    const methodStats: Record<
      string,
      {
        method: string;
        code: string;
        transactions: number;
        revenue: number;
        avg_transaction: number;
      }
    > = {};

    payments.forEach((payment) => {
      const method = payment.payment_methods.name;
      const code = payment.payment_methods.code;

      if (!methodStats[code]) {
        methodStats[code] = {
          method,
          code,
          transactions: 0,
          revenue: 0,
          avg_transaction: 0,
        };
      }

      methodStats[code].transactions++;
      methodStats[code].revenue += Number(payment.amount);
    });

    // Calculate averages
    Object.keys(methodStats).forEach((code) => {
      const stats = methodStats[code];
      stats.avg_transaction =
        stats.transactions > 0 ? stats.revenue / stats.transactions : 0;
    });

    const totalRevenue = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    return {
      period: {
        start: startDate,
        end: endDate,
      },
      methods: Object.values(methodStats),
      total_revenue: totalRevenue,
      total_transactions: payments.length,
    };
  }

  /**
   * Analytics: Success rate by method
   */
  async getSuccessRateByMethod() {
    const payments = await this.prisma.payment.findMany({
      include: {
        payment_methods: true,
      },
    });

    const methodStats: Record<
      string,
      {
        method: string;
        code: string;
        success: number;
        failed: number;
        pending: number;
        total: number;
        success_rate: number;
      }
    > = {};

    payments.forEach((payment) => {
      const code = payment.payment_methods.code;
      const method = payment.payment_methods.name;

      if (!methodStats[code]) {
        methodStats[code] = {
          method,
          code,
          success: 0,
          failed: 0,
          pending: 0,
          total: 0,
          success_rate: 0,
        };
      }

      methodStats[code].total++;

      if (payment.status === 'completed') {
        methodStats[code].success++;
      } else if (payment.status === 'failed') {
        methodStats[code].failed++;
      } else if (payment.status === 'pending') {
        methodStats[code].pending++;
      }
    });

    // Calculate success rates
    Object.keys(methodStats).forEach((code) => {
      const stats = methodStats[code];
      const completedOrFailed = stats.success + stats.failed;
      stats.success_rate =
        completedOrFailed > 0 ? (stats.success / completedOrFailed) * 100 : 0;
    });

    return {
      methods: Object.values(methodStats),
      overall: {
        total_payments: payments.length,
        completed: payments.filter((p) => p.status === 'completed').length,
        failed: payments.filter((p) => p.status === 'failed').length,
        pending: payments.filter((p) => p.status === 'pending').length,
      },
    };
  }
}
