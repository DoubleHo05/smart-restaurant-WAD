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

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly momoService: MomoService,
    private readonly zaloPayService: ZaloPayService,
    private readonly vnpayService: VnPayService,
    private readonly cashService: CashService,
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
    const billRequest = await this.prisma.billRequest.findUnique({
      where: { id: bill_request_id },
    });

    if (!billRequest) {
      throw new NotFoundException('Bill request not found');
    }

    // Lấy order IDs từ merged_order_ids hoặc bill_request
    const orderIds = billRequest.order_ids as string[];

    // Update tất cả orders sang 'completed'
    await this.prisma.order.updateMany({
      where: {
        id: { in: orderIds },
      },
      data: {
        status: 'completed',
      },
    });

    // Update bill_request sang 'completed'
    await this.prisma.billRequest.update({
      where: { id: bill_request_id },
      data: {
        status: 'completed',
      },
    });

    // TODO Phase 4: Emit socket event 'bill-paid'

    return { success: true };
  }

  async handleVNPayIPN(query: any) {
    // 1. Verify signature
    const isValid = this.vnpayService.verifySignature(query);
    if (!isValid) {
      return { RspCode: '97', Message: 'Invalid signature' };
    }

    // 2. Lấy payment_id từ vnp_TxnRef
    const payment_id = query.vnp_TxnRef;
    const payment = await this.prisma.payment.findUnique({
      where: { id: payment_id },
      include: { bill_requests: true },
    });

    if (!payment) {
      return { RspCode: '01', Message: 'Order not found' };
    }

    // 3. Kiểm tra amount (convert Decimal to number)
    const vnp_Amount = parseInt(query.vnp_Amount) / 100;
    if (vnp_Amount !== payment.amount.toNumber()) {
      return { RspCode: '04', Message: 'Invalid amount' };
    }

    // 4. Update payment status (dùng đúng column names)
    const responseCode = query.vnp_ResponseCode;
    const status = responseCode === '00' ? 'completed' : 'failed';

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        gateway_trans_id: query.vnp_TransactionNo,
        completed_at: status === 'completed' ? new Date() : null,
        failed_reason: status === 'failed' ? query.vnp_Message : null,
      },
    });

    // 5. Nếu thành công, complete bill
    if (status === 'completed' && payment.bill_request_id) {
      await this.completeBillPayment(payment.bill_request_id);
    }

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
}
