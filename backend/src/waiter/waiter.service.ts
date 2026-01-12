import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TablesService } from '../tables/tables.service';
import { RejectOrderDto } from './dto/reject-order.dto';
import { PendingOrdersFilterDto } from './dto/pending-orders-filter.dto';

@Injectable()
export class WaiterService {
  constructor(
    private prisma: PrismaService,
    private tablesService: TablesService,
  ) {}

  /**
   * Get pending orders for a waiter's restaurant
   * Waiters can only see orders from their assigned restaurant
   */
  async getPendingOrders(
    restaurantId: string,
    filters?: PendingOrdersFilterDto,
  ) {
    const whereClause: any = {
      restaurant_id: restaurantId,
      status: 'pending',
    };

    // Filter by table if specified
    if (filters?.table_id) {
      whereClause.table_id = filters.table_id;
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        table: {
          select: {
            id: true,
            table_number: true,
            capacity: true,
            location: true,
          },
        },
        order_items: {
          include: {
            menu_item: {
              select: {
                id: true,
                name: true,
                price: true,
                prep_time_minutes: true,
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
        created_at: 'asc', // Oldest pending orders first
      },
    });

    return {
      success: true,
      data: orders.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        table: {
          id: order.table.id,
          number: order.table.table_number,
          location: order.table.location,
        },
        status: order.status,
        total: order.total,
        items_count: order.order_items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
        special_requests: order.special_requests,
        created_at: order.created_at,
        items: order.order_items.map((item) => ({
          id: item.id,
          name: item.menu_item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
          modifiers: item.modifiers.map((mod) => ({
            name: mod.modifier_option.name,
            price_adjustment: mod.price_adjustment,
          })),
          special_requests: item.special_requests,
        })),
      })),
      total: orders.length,
    };
  }

  /**
   * Accept an order (waiter confirms they will handle it)
   * Validates that the order belongs to the waiter's restaurant
   */
  async acceptOrder(orderId: string, restaurantId: string, waiterId: string) {
    // Find the order and verify it belongs to the restaurant
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        table: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Verify order belongs to waiter's restaurant
    if (order.restaurant_id !== restaurantId) {
      throw new ForbiddenException(
        'You can only accept orders from your restaurant',
      );
    }

    // Check if order is in pending status
    if (order.status !== 'pending') {
      throw new BadRequestException(
        `Order cannot be accepted. Current status: ${order.status}`,
      );
    }

    // Update order status to accepted
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'accepted',
        accepted_at: new Date(),
      },
      include: {
        table: {
          select: {
            id: true,
            table_number: true,
            location: true,
          },
        },
        order_items: {
          include: {
            menu_item: {
              select: {
                id: true,
                name: true,
                prep_time_minutes: true,
              },
            },
            modifiers: {
              include: {
                modifier_option: {
                  select: {
                    name: true,
                    price_adjustment: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // TODO: Emit Socket.IO event to kitchen (order_accepted)
    // TODO: Emit Socket.IO event to customer (order_accepted)

    // Auto-update table status
    await this.tablesService.autoUpdateTableStatusByOrder(orderId);

    return {
      success: true,
      message: 'Order accepted successfully',
      data: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        status: updatedOrder.status,
        table: updatedOrder.table,
        total: updatedOrder.total,
        accepted_at: updatedOrder.accepted_at,
        items: updatedOrder.order_items.map((item) => ({
          name: item.menu_item.name,
          quantity: item.quantity,
          prep_time: item.menu_item.prep_time_minutes,
        })),
      },
    };
  }

  /**
   * Reject an order with a reason
   * Validates that the order belongs to the waiter's restaurant
   */
  async rejectOrder(
    orderId: string,
    restaurantId: string,
    rejectDto: RejectOrderDto,
  ) {
    // Find the order and verify it belongs to the restaurant
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        table: {
          select: {
            table_number: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Verify order belongs to waiter's restaurant
    if (order.restaurant_id !== restaurantId) {
      throw new ForbiddenException(
        'You can only reject orders from your restaurant',
      );
    }

    // Check if order is in pending status
    if (order.status !== 'pending') {
      throw new BadRequestException(
        `Order cannot be rejected. Current status: ${order.status}`,
      );
    }

    // Update order status to rejected
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'rejected',
        special_requests: order.special_requests
          ? `${order.special_requests}\n\nREJECTION REASON: ${rejectDto.reason}`
          : `REJECTION REASON: ${rejectDto.reason}`,
      },
    });

    // TODO: Emit Socket.IO event to customer (order_rejected)

    // Auto-update table status (table might become available if no other orders)
    await this.tablesService.autoUpdateTableStatusByOrder(orderId);

    return {
      success: true,
      message: 'Order rejected successfully',
      data: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        status: updatedOrder.status,
        table_number: order.table.table_number,
        rejection_reason: rejectDto.reason,
      },
    };
  }

  /**
   * Mark an order as served
   * Validates that the order belongs to the waiter's restaurant
   */
  async serveOrder(orderId: string, restaurantId: string, waiterId: string) {
    // Find the order and verify it belongs to the restaurant
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        table: {
          select: {
            id: true,
            table_number: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Verify order belongs to waiter's restaurant
    if (order.restaurant_id !== restaurantId) {
      throw new ForbiddenException(
        'You can only serve orders from your restaurant',
      );
    }

    // Check if order is in ready status
    if (order.status !== 'ready') {
      throw new BadRequestException(
        `Order cannot be served. Current status: ${order.status}. Order must be in 'ready' status.`,
      );
    }

    // Update order status to served
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'served',
        served_at: new Date(),
      },
    });

    // TODO: Emit Socket.IO event to customer (order_served)

    // Auto-update table status (table still occupied until order completed)
    await this.tablesService.autoUpdateTableStatusByOrder(orderId);

    return {
      success: true,
      message: 'Order marked as served',
      data: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        status: updatedOrder.status,
        table_number: order.table.table_number,
        served_at: updatedOrder.served_at,
      },
    };
  }

  /**
   * Get all orders for waiter's restaurant with various statuses
   * Useful for waiter dashboard
   */
  async getRestaurantOrders(
    restaurantId: string,
    status?: string,
    tableId?: string,
  ) {
    const whereClause: any = {
      restaurant_id: restaurantId,
    };

    if (status) {
      whereClause.status = status;
    }

    if (tableId) {
      whereClause.table_id = tableId;
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        table: {
          select: {
            id: true,
            table_number: true,
            location: true,
          },
        },
        order_items: {
          include: {
            menu_item: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 50, // Limit to last 50 orders for performance
    });

    return {
      success: true,
      data: orders.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        table: order.table,
        status: order.status,
        total: order.total,
        items_count: order.order_items.length,
        created_at: order.created_at,
        accepted_at: order.accepted_at,
        ready_at: order.ready_at,
        served_at: order.served_at,
      })),
      total: orders.length,
    };
  }
}
