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
}
