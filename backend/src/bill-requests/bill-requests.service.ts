import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillRequestDto } from './dto/create-bill-request.dto';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class BillRequestsService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Customer tạo bill request
   * Tác dụng: Gộp tất cả orders chưa thanh toán của bàn → tạo 1 bill request
   */
  async createBillRequest(dto: CreateBillRequestDto, customerId?: string) {
    // 1. Query orders chưa thanh toán (OPTIMIZED)
    const unpaidOrders = await this.prisma.order.findMany({
      where: {
        table_id: dto.table_id,
        status: { in: ['pending', 'accepted', 'preparing', 'ready', 'served'] },
      },
      select: {
        id: true,
        order_number: true,
        total: true,
        status: true,
      },
      orderBy: { created_at: 'asc' },
    });

    if (unpaidOrders.length === 0) {
      throw new BadRequestException('Không có order nào cần thanh toán');
    }

    // 2. Kiểm tra có bill request pending khác không
    const existingRequest = await this.prisma.billRequest.findFirst({
      where: {
        table_id: dto.table_id,
        status: 'pending',
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Đã có yêu cầu thanh toán đang chờ xử lý');
    }

    // 3. Tính tổng tiền
    const subtotal = unpaidOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );
    const tipsAmount = dto.tips_amount || 0;
    const totalAmount = subtotal + tipsAmount;

    // 4. Lấy thông tin table và restaurant
    const table = await this.prisma.table.findUnique({
      where: { id: dto.table_id },
      select: { restaurant_id: true, table_number: true, location: true },
    });

    if (!table) {
      throw new NotFoundException('Bàn không tồn tại');
    }

    // 5. Tạo bill request trong database
    const billRequest = await this.prisma.billRequest.create({
      data: {
        restaurant_id: table.restaurant_id,
        table_id: dto.table_id,
        payment_method_code: dto.payment_method,
        subtotal,
        tips_amount: tipsAmount,
        total_amount: totalAmount,
        order_ids: unpaidOrders.map((o) => o.id), // JSON array
        customer_note: dto.customer_note,
        status: 'pending',
      },
      include: {
        tables: true,
      },
    });

    // 6. Notify waiters qua Socket.IO (Phase 4)
    try {
      await this.notificationsGateway.notifyBillRequestCreated({
        ...billRequest,
        payment_method: dto.payment_method,
      });
    } catch (error) {
      console.error('❌ Failed to emit bill request notification:', error.message);
    }

    // 7. Return response
    return {
      id: billRequest.id,
      subtotal,
      tips_amount: tipsAmount,
      total_amount: totalAmount,
      order_count: unpaidOrders.length,
      status: 'pending',
      message: 'Yêu cầu đã được gửi. Vui lòng chờ waiter xác nhận.',
    };
  }

  /**
   * Waiter lấy danh sách bill requests của restaurant
   */
  async getBillRequestsByRestaurant(restaurantId: string, status?: string) {
    const where: any = { restaurant_id: restaurantId };
    if (status) {
      where.status = status;
    }

    const billRequests = await this.prisma.billRequest.findMany({
      where,
      include: {
        tables: {
          select: {
            table_number: true,
            location: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return billRequests.map((br) => ({
      id: br.id,
      table_number: br.tables.table_number,
      table_location: br.tables.location,
      total_amount: Number(br.total_amount),
      tips_amount: Number(br.tips_amount),
      payment_method: br.payment_method_code,
      order_count: (br.order_ids as string[]).length,
      customer_note: br.customer_note,
      status: br.status,
      created_at: br.created_at,
    }));
  }

  /**
   * Lấy chi tiết 1 bill request
   */
  async getBillRequestById(id: string) {
    const billRequest = await this.prisma.billRequest.findUnique({
      where: { id },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            location: true,
          },
        },
        users: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    if (!billRequest) {
      throw new NotFoundException('Bill request không tồn tại');
    }

    // Lấy chi tiết các orders
    const orderIds = billRequest.order_ids as string[];
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
      id: billRequest.id,
      table: billRequest.tables,
      orders: orders.map((o) => ({
        id: o.id,
        order_number: o.order_number,
        items: o.order_items,
        subtotal: Number(o.total),
      })),
      subtotal: Number(billRequest.subtotal),
      tips_amount: Number(billRequest.tips_amount),
      total_amount: Number(billRequest.total_amount),
      payment_method: billRequest.payment_method_code,
      customer_note: billRequest.customer_note,
      status: billRequest.status,
      waiter: billRequest.users,
      created_at: billRequest.created_at,
      accepted_at: billRequest.accepted_at,
    };
  }

  /**
   * Waiter accept bill request
   */
  async acceptBillRequest(billRequestId: string, waiterId: string) {
    const billRequest = await this.prisma.billRequest.findUnique({
      where: { id: billRequestId },
      include: { tables: true },
    });

    if (!billRequest) {
      throw new NotFoundException('Bill request không tồn tại');
    }

    if (billRequest.status !== 'pending') {
      throw new BadRequestException('Bill request đã được xử lý');
    }

    // Update status sang accepted
    await this.prisma.billRequest.update({
      where: { id: billRequestId },
      data: {
        status: 'accepted',
        accepted_by: waiterId,
        accepted_at: new Date(),
      },
    });

    // Tạo payment và generate QR/payment URL
    const paymentResult =
      await this.paymentsService.initiatePaymentFromBillRequest({
        bill_request_id: billRequestId,
        payment_method: billRequest.payment_method_code,
        amount: Number(billRequest.subtotal),
        tips_amount: Number(billRequest.tips_amount),
        order_ids: billRequest.order_ids as string[],
        restaurant_id: billRequest.restaurant_id,
      });

    return {
      bill_request_id: billRequestId,
      payment_id: paymentResult.payment_id,
      payment_method: billRequest.payment_method_code,
      subtotal: Number(billRequest.subtotal),
      tips_amount: Number(billRequest.tips_amount),
      total_amount: Number(billRequest.total_amount),
      transaction_id: paymentResult.transaction_id,
      qr_code: paymentResult.qr_code,
      payment_url: paymentResult.payment_url,
      message: 'Bill request đã được chấp nhận. Khách hàng có thể thanh toán.',
    };
  }

  /**
   * Cancel/Reject bill request
   */
  async cancelBillRequest(id: string, reason?: string) {
    const billRequest = await this.prisma.billRequest.findUnique({
      where: { id },
    });

    if (!billRequest) {
      throw new NotFoundException('Bill request không tồn tại');
    }

    if (billRequest.status !== 'pending') {
      throw new BadRequestException('Không thể hủy bill request đã được xử lý');
    }

    await this.prisma.billRequest.update({
      where: { id },
      data: {
        status: 'cancelled',
        customer_note: reason
          ? `${billRequest.customer_note}\nLý do hủy: ${reason}`
          : billRequest.customer_note,
      },
    });

    return { message: 'Bill request đã bị hủy' };
  }
}
