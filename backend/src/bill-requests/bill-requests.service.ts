import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CreateBillRequestDto } from './dto/create-bill-request.dto';
import { AcceptBillRequestDto } from './dto/accept-bill-request.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';

@Injectable()
export class BillRequestsService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Create a bill request by aggregating all unpaid orders for a table
   */
  async create(createDto: CreateBillRequestDto) {
    try {
      console.log('🔍 [Bill Request] Creating with data:', createDto);

      // 1. Validate table exists
      const table = await this.prisma.table.findUnique({
        where: { id: createDto.table_id },
        include: { restaurant: true },
      });

      if (!table) {
        throw new NotFoundException('Table not found');
      }

      console.log('✅ [Bill Request] Table found:', {
        id: table.id,
        table_number: table.table_number,
        restaurant: table.restaurant.name,
      });

      // 2. Check if there's already a pending bill request for this table
      const existingBillRequest = await this.prisma.bill_requests.findFirst({
        where: {
          table_id: createDto.table_id,
          status: 'pending', // Only check for pending requests
        },
      });

      if (existingBillRequest) {
        console.log(
          '⚠️ [Bill Request] Pending bill request already exists:',
          existingBillRequest.id,
        );
        // Return existing pending bill request instead of throwing error
        return this.findOne(existingBillRequest.id);
      }

      // 3. Get all unpaid orders for this table
      const orders = await this.prisma.order.findMany({
        where: {
          table_id: createDto.table_id,
          status: {
            notIn: ['completed', 'cancelled', 'rejected'],
          },
        },
        include: {
          order_items: {
            include: {
              menu_item: true,
              modifiers: {
                include: {
                  modifier_option: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'asc',
        },
      });

      console.log('🔍 [Bill Request] Orders found:', {
        table_id: createDto.table_id,
        order_count: orders.length,
        order_statuses: orders.map((o) => ({ id: o.id, status: o.status })),
      });

      if (orders.length === 0) {
        throw new BadRequestException('No unpaid orders found for this table');
      }

      // 4. Calculate subtotal from all orders
      const subtotal = orders.reduce((sum, order) => {
        return sum + Number(order.total);
      }, 0);

      // 5. Calculate total amount
      const tipsAmount = createDto.tips_amount || 0;
      const totalAmount = subtotal + tipsAmount;

      // 6. Create bill request
      const orderIds = orders.map((order) => order.id);

      const billRequest = await this.prisma.bill_requests.create({
        data: {
          restaurant_id: table.restaurant_id,
          table_id: createDto.table_id,
          payment_method_code: createDto.payment_method_code,
          subtotal,
          tips_amount: tipsAmount,
          total_amount: totalAmount,
          order_ids: orderIds,
          customer_note: createDto.customer_note,
          status: 'pending',
        },
      });

      console.log('🧾 [Bill Request] Created:', {
        id: billRequest.id,
        table_id: createDto.table_id,
        total_amount: totalAmount,
        order_count: orders.length,
      });

      // 7. Return bill request with full details
      return this.findOne(billRequest.id);
    } catch (error) {
      console.error('❌ [Bill Request] Create error:', {
        message: error.message,
        stack: error.stack,
        createDto,
      });
      throw error;
    }
  }

  /**
   * Get bill request details with orders and payment method
   */
  async findOne(id: string) {
    const billRequest = await this.prisma.bill_requests.findUnique({
      where: { id },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            location: true,
          },
        },
        restaurants: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    if (!billRequest) {
      throw new NotFoundException('Bill request not found');
    }

    // Get payment method details
    const paymentMethod = await this.prisma.payment_methods.findUnique({
      where: { code: billRequest.payment_method_code },
    });

    // Get orders
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
                id: true,
                name: true,
                price: true,
              },
            },
            modifiers: {
              include: {
                modifier_option: {
                  select: {
                    id: true,
                    name: true,
                    price_adjustment: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return {
      ...billRequest,
      payment_method: paymentMethod,
      orders,
    };
  }

  /**
   * Get active bill request for a table (if any)
   */
  async findActiveByTable(tableId: string) {
    const billRequest = await this.prisma.bill_requests.findFirst({
      where: {
        table_id: tableId,
        status: { in: ['pending', 'accepted'] },
      },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!billRequest) {
      return null;
    }

    return this.findOne(billRequest.id);
  }

  /**
   * Get all bill requests for a restaurant
   */
  async findByRestaurant(restaurantId: string) {
    const billRequests = await this.prisma.bill_requests.findMany({
      where: {
        tables: {
          restaurant_id: restaurantId,
        },
      },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      success: true,
      data: billRequests,
      total: billRequests.length,
    };
  }

  /**
   * Apply discount to bill request (before accept)
   */
  async applyDiscount(
    billRequestId: string,
    discountDto: ApplyDiscountDto,
    staffId: string,
  ) {
    console.log('🎁 [Bill Request] Applying discount:', {
      billRequestId,
      ...discountDto,
      staffId,
    });

    // 1. Find bill request
    const billRequest = await this.prisma.bill_requests.findUnique({
      where: { id: billRequestId },
    });

    if (!billRequest) {
      throw new NotFoundException('Bill request not found');
    }

    if (billRequest.status !== 'pending') {
      throw new BadRequestException(
        'Can only apply discount to pending bill requests',
      );
    }

    // 2. Calculate discount amount
    const subtotal = Number(billRequest.subtotal);
    const tipsAmount = Number(billRequest.tips_amount || 0);
    let discountAmount = 0;

    if (discountDto.discount_type === 'percentage') {
      discountAmount = subtotal * (discountDto.discount_value / 100);
    } else if (discountDto.discount_type === 'fixed') {
      discountAmount = discountDto.discount_value;
    }

    // Ensure discount doesn't exceed subtotal
    if (discountAmount > subtotal) {
      throw new BadRequestException('Discount amount cannot exceed subtotal');
    }

    // 3. Calculate tax (applied after discount)
    const taxRate = discountDto.tax_rate || 0;
    const amountAfterDiscount = subtotal - discountAmount + tipsAmount;
    const taxAmount = amountAfterDiscount * (taxRate / 100);

    // 4. Calculate final amount
    const finalAmount = amountAfterDiscount + taxAmount;

    console.log('💰 [Bill Request] Calculation:', {
      subtotal,
      tipsAmount,
      discountAmount,
      amountAfterDiscount,
      taxRate,
      taxAmount,
      finalAmount,
    });

    // 5. Update bill request
    const updated = await this.prisma.bill_requests.update({
      where: { id: billRequestId },
      data: {
        discount_type: discountDto.discount_type,
        discount_value: discountDto.discount_value,
        discount_amount: discountAmount,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        final_amount: finalAmount,
        total_amount: finalAmount, // Keep total_amount in sync for backward compatibility
        discount_applied_by: staffId,
        discount_applied_at: new Date(),
      },
    });

    console.log('✅ [Bill Request] Discount applied successfully');

    return {
      success: true,
      message: 'Discount applied successfully',
      data: {
        id: updated.id,
        subtotal: updated.subtotal,
        discount_type: updated.discount_type,
        discount_value: updated.discount_value,
        discount_amount: updated.discount_amount,
        tips_amount: updated.tips_amount,
        tax_rate: updated.tax_rate,
        tax_amount: updated.tax_amount,
        final_amount: updated.final_amount,
      },
    };
  }

  /**
   * Waiter accepts bill request
   */
  async accept(id: string) {
    try {
      console.log('🔍 [Bill Request] Accepting:', { id });

      const billRequest = await this.prisma.bill_requests.findUnique({
        where: { id },
        include: {
          tables: {
            select: {
              restaurant_id: true,
            },
          },
        },
      });

      if (!billRequest) {
        throw new NotFoundException('Bill request not found');
      }

      // Determine payment amount: use final_amount if discount applied, otherwise total_amount
      const paymentAmount = billRequest.final_amount || billRequest.total_amount;

      console.log('✅ [Bill Request] Found:', {
        id: billRequest.id,
        status: billRequest.status,
        payment_method: billRequest.payment_method_code,
        total_amount: billRequest.total_amount,
        final_amount: billRequest.final_amount,
        discount_applied: !!billRequest.discount_amount,
        discount_amount: billRequest.discount_amount,
        payment_amount: paymentAmount,
        order_ids: billRequest.order_ids,
        restaurant_id: billRequest.tables.restaurant_id,
      });

      if (billRequest.status !== 'pending') {
        throw new BadRequestException(
          `Cannot accept bill request with status "${billRequest.status}"`,
        );
      }

      const updated = await this.prisma.bill_requests.update({
        where: { id },
        data: {
          status: 'accepted',
          accepted_at: new Date(),
        },
      });

      console.log('🔄 [Bill Request] Creating payment with:', {
        bill_request_id: id,
        amount: paymentAmount,
        payment_method: billRequest.payment_method_code,
        tips_amount: billRequest.tips_amount || 0,
        order_ids: billRequest.order_ids || [],
        restaurant_id: billRequest.tables.restaurant_id,
      });
      
      const payment = await this.paymentsService.initiatePaymentFromBillRequest(
        {
          bill_request_id: id,
          amount: paymentAmount, // Use final amount after discount/tax
          payment_method: billRequest.payment_method_code,
          tips_amount: billRequest.tips_amount || 0,
          order_ids: billRequest.order_ids || [],
          restaurant_id: billRequest.tables.restaurant_id,
        },
      );

      console.log('✅ [Bill Request] Accepted:', {
        id,
        payment_id: payment.payment_id,
        payment_url: payment.payment_url,
        customer_id: billRequest.customer_id,
      });

      // Emit payment URL to customer via Socket.IO
      // Use broadcast since customer may be anonymous (no customer_id)
      const finalAmount = billRequest.final_amount || billRequest.total_amount;
      
      if (payment.payment_url) {
        console.log(
          '📡 [Bill Request] Broadcasting payment_ready event for bill:',
          id,
        );
        this.notificationsGateway.emitToAll('payment_ready', {
          bill_request_id: id,
          payment_id: payment.payment_id,
          payment_url: payment.payment_url,
          payment_method: billRequest.payment_method_code,
          amount: finalAmount,
        });
      } else {
        // For CASH payment (no URL), notify customer that bill is accepted
        console.log(
          '📡 [Bill Request] Broadcasting bill_accepted event for CASH payment:',
          id,
        );
        this.notificationsGateway.emitToAll('bill_accepted', {
          bill_request_id: id,
          payment_id: payment.payment_id,
          payment_method: billRequest.payment_method_code,
          amount: finalAmount,
        });
      }

      return {
        success: true,
        message: 'Bill request accepted',
        data: {
          bill_request_id: id,
          payment_id: payment.payment_id,
          payment_url: payment.payment_url,
          transaction_id: payment.transaction_id,
        },
      };
    } catch (error) {
      console.error('❌ [Bill Request] Accept error:', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Reject bill request
   */
  async reject(id: string, rejection_reason: string) {
    const billRequest = await this.prisma.bill_requests.findUnique({
      where: { id },
    });

    if (!billRequest) {
      throw new NotFoundException('Bill request not found');
    }

    if (billRequest.status !== 'pending') {
      throw new BadRequestException(
        `Cannot reject bill request with status "${billRequest.status}"`,
      );
    }

    await this.prisma.bill_requests.update({
      where: { id },
      data: {
        status: 'rejected',
      },
    });

    // Notify customer
    if (billRequest.customer_id) {
      this.notificationsGateway.emitToUser(
        billRequest.customer_id,
        'bill_request_rejected',
        {
          bill_request_id: id,
          reason: rejection_reason,
        },
      );
    }

    console.log('❌ [Bill Request] Rejected:', {
      id,
      reason: rejection_reason,
    });

    return {
      success: true,
      message: 'Bill request rejected',
    };
  }

  /**
   * Cancel bill request
   */
  async cancel(id: string) {
    const billRequest = await this.prisma.bill_requests.findUnique({
      where: { id },
    });

    if (!billRequest) {
      throw new NotFoundException('Bill request not found');
    }

    if (billRequest.status === 'completed') {
      throw new BadRequestException('Cannot cancel completed bill request');
    }

    await this.prisma.bill_requests.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });

    console.log('❌ [Bill Request] Cancelled:', id);

    return { message: 'Bill request cancelled successfully' };
  }

  /**
   * Complete cash payment for accepted bill request
   */
  async completeCashPayment(billRequestId: string, receivedAmount: number) {
    try {
      console.log('💵 [Bill Request] Completing cash payment:', {
        billRequestId,
        receivedAmount,
      });

      // 1. Find the bill request
      const billRequest = await this.prisma.bill_requests.findUnique({
        where: { id: billRequestId },
        include: {
          payments: true,
        },
      });

      if (!billRequest) {
        throw new NotFoundException('Bill request not found');
      }

      if (billRequest.status !== 'accepted') {
        throw new BadRequestException(
          `Bill request must be accepted first. Current status: ${billRequest.status}`,
        );
      }

      if (billRequest.payment_method_code?.toLowerCase() !== 'cash') {
        throw new BadRequestException(
          `This endpoint is only for cash payments. Current method: ${billRequest.payment_method_code}`,
        );
      }

      // 2. Find the payment record created during accept
      const payment = billRequest.payments?.[0];
      if (!payment) {
        throw new NotFoundException(
          'Payment record not found for this bill request',
        );
      }

      // 3. Update payment status to completed
      await this.prisma.payments.update({
        where: { id: payment.id },
        data: {
          status: 'completed',
          updated_at: new Date(),
        },
      });

      // 4. Update bill request status to completed
      await this.prisma.bill_requests.update({
        where: { id: billRequestId },
        data: {
          status: 'completed',
          updated_at: new Date(),
        },
      });

      // 5. Update all orders to completed
      const orderIds = billRequest.order_ids as string[];
      await this.prisma.order.updateMany({
        where: {
          id: { in: orderIds },
        },
        data: {
          status: 'completed',
          updated_at: new Date(),
        },
      });

      console.log('✅ [Bill Request] Cash payment completed:', {
        billRequestId,
        paymentId: payment.id,
        orderCount: orderIds.length,
      });

      // 6. Emit payment_completed event via socket
      this.notificationsGateway.emitToAll('payment_completed', {
        bill_request_id: billRequestId,
        payment_id: payment.id,
        status: 'completed',
        message: 'Payment completed successfully',
      });

      return {
        success: true,
        message: 'Cash payment completed successfully',
        payment_id: payment.id,
        bill_request_id: billRequestId,
      };
    } catch (error) {
      console.error('❌ [Bill Request] Complete cash payment error:', {
        message: error.message,
        stack: error.stack,
        billRequestId,
      });
      throw error;
    }
  }
}
