import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TablesService } from '../tables/tables.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { RejectOrderDto } from './dto/reject-order.dto';
import { PendingOrdersFilterDto } from './dto/pending-orders-filter.dto';

@Injectable()
export class WaiterService {
  constructor(
    private prisma: PrismaService,
    private tablesService: TablesService,
    private notificationsGateway: NotificationsGateway,
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
        table_id: order.table?.id || null,
        table_number: order.table?.table_number || null,
        customer_id: order.customer_id || null,
        customer_name: null, // TODO: Join with users table if needed
        status: order.status,
        total_price: order.total,
        special_instructions: order.special_requests,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.order_items.map((item) => ({
          id: item.id,
          menu_item_id: item.menu_item_id,
          name: item.menu_item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          notes: item.special_requests,
          status: item.status,
          rejection_reason: item.rejection_reason,
          modifiers: item.modifiers.map((mod) => ({
            id: mod.modifier_option?.id || mod.id,
            name: mod.modifier_option.name,
            price: mod.price_adjustment,
          })),
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

    // Update order status to accepted and assign to waiter
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'accepted',
        accepted_at: new Date(),
        waiter_id: waiterId,
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

    // Emit Socket.IO event to kitchen (order_accepted)
    this.notificationsGateway.emitToRole('kitchen', 'order_accepted', {
      order_id: updatedOrder.id,
      order_number: updatedOrder.order_number,
      restaurant_id: restaurantId,
      table_number: updatedOrder.table.table_number,
      items_count: updatedOrder.order_items.length,
    });

    // Emit Socket.IO event to customer (order_status_update)
    if (order.customer_id) {
      this.notificationsGateway.emitToUser(
        order.customer_id,
        'order_status_update',
        {
          order_id: updatedOrder.id,
          order_number: updatedOrder.order_number,
          status: 'accepted',
          message: 'Your order has been accepted by the waiter',
        },
      );
    }

    // Auto-update table status
    await this.tablesService.autoUpdateTableStatusByOrder(orderId);

    return {
      success: true,
      message: 'Order accepted successfully',
      data: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        status: updatedOrder.status,
        table_id: updatedOrder.table.id,
        table_number: updatedOrder.table.table_number,
        customer_id: updatedOrder.customer_id,
        customer_name: null,
        total_price: updatedOrder.total,
        special_instructions: updatedOrder.special_requests,
        created_at: updatedOrder.created_at,
        updated_at: updatedOrder.updated_at,
        accepted_at: updatedOrder.accepted_at,
        preparing_started_at: updatedOrder.preparing_started_at,
        ready_at: updatedOrder.ready_at,
        served_at: updatedOrder.served_at,
        completed_at: updatedOrder.completed_at,
        items: updatedOrder.order_items.map((item) => ({
          id: item.id,
          menu_item_id: item.menu_item_id,
          name: item.menu_item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          notes: item.special_requests,
          status: item.status,
          rejection_reason: item.rejection_reason,
          modifiers: item.modifiers.map((mod) => ({
            id: mod.modifier_option?.id || mod.id,
            name: mod.modifier_option.name,
            price: mod.price_adjustment,
          })),
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

    // Emit Socket.IO event to customer (order_rejected)
    if (order.customer_id) {
      this.notificationsGateway.emitToUser(
        order.customer_id,
        'order_rejected',
        {
          order_id: updatedOrder.id,
          order_number: updatedOrder.order_number,
          reason: rejectDto.reason,
          message: 'Your order has been rejected',
        },
      );
    }

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

    // Emit Socket.IO event to customer (order_served)
    if (order.customer_id) {
      this.notificationsGateway.emitToUser(
        order.customer_id,
        'order_status_update',
        {
          order_id: updatedOrder.id,
          order_number: updatedOrder.order_number,
          status: 'served',
          message: 'Your order has been served',
        },
      );
    }

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
   * Complete an order (customer paid at counter)
   * Status: served -> completed
   */
  async completeOrder(orderId: string, restaurantId: string, waiterId: string) {
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
        'You can only complete orders from your restaurant',
      );
    }

    // Check if order is in served status (or allow ready for direct completion)
    if (!['served', 'ready'].includes(order.status)) {
      throw new BadRequestException(
        `Order cannot be completed. Current status: ${order.status}. Order must be in 'served' or 'ready' status.`,
      );
    }

    // Update order status to completed
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'completed',
        completed_at: new Date(),
      },
    });

    // Emit Socket.IO event to customer
    if (order.customer_id) {
      this.notificationsGateway.emitToUser(
        order.customer_id,
        'order_status_update',
        {
          order_id: updatedOrder.id,
          order_number: updatedOrder.order_number,
          status: 'completed',
          message: 'Your order has been completed',
        },
      );
    }

    // Auto-update table status (free table if all orders completed)
    await this.tablesService.autoUpdateTableStatusByOrder(orderId);

    return {
      success: true,
      message: 'Order marked as completed',
      data: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        status: updatedOrder.status,
        table_number: order.table.table_number,
        completed_at: updatedOrder.completed_at,
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
      // Parse comma-separated status string into array
      const statusArray = status.split(',').map((s) => s.trim());
      whereClause.status = { in: statusArray };
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
        table_id: order.table?.id || null,
        table_number: order.table?.table_number || null,
        customer_id: order.customer_id || null,
        customer_name: null,
        status: order.status,
        total_price: order.total,
        special_instructions: order.special_requests,
        items: order.order_items.map((item) => ({
          id: item.id,
          menu_item_id: item.menu_item_id,
          name: item.menu_item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          notes: item.special_requests,
          status: item.status,
          rejection_reason: item.rejection_reason,
          modifiers: [],
        })),
        created_at: order.created_at,
        updated_at: order.updated_at,
        accepted_at: order.accepted_at,
        preparing_started_at: order.preparing_started_at,
        ready_at: order.ready_at,
        served_at: order.served_at,
        completed_at: order.completed_at,
      })),
      total: orders.length,
    };
  }

  /**
   * Get waiter performance analytics
   * Track orders accepted/rejected, average service time
   * Multi-restaurant support: filters by restaurant_id
   */
  async getWaiterPerformance(waiterId: string, restaurantId: string) {
    // Get all orders handled by this waiter in the restaurant
    const acceptedOrders = await this.prisma.order.findMany({
      where: {
        restaurant_id: restaurantId,
        waiter_id: waiterId,
        status: {
          in: ['accepted', 'preparing', 'ready', 'served', 'completed'],
        },
      },
      select: {
        id: true,
        order_number: true,
        status: true,
        total: true,
        created_at: true,
        accepted_at: true,
        served_at: true,
        completed_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Get rejected orders count (orders where rejection reason mentions this waiter)
    // Since we don't explicitly track who rejected, we'll count all rejected orders in the restaurant
    // This is a limitation without full auth - in production, track rejected_by_waiter_id
    const rejectedOrders = await this.prisma.order.count({
      where: {
        restaurant_id: restaurantId,
        status: 'rejected',
      },
    });

    // Calculate statistics
    const totalAccepted = acceptedOrders.length;
    const totalServed = acceptedOrders.filter(
      (o) => o.status === 'served' || o.status === 'completed',
    ).length;
    const totalCompleted = acceptedOrders.filter(
      (o) => o.status === 'completed',
    ).length;

    // Calculate average service time (from order created to served)
    const servedOrders = acceptedOrders.filter((o) => o.served_at !== null);
    let averageServiceTimeMinutes = 0;

    if (servedOrders.length > 0) {
      const totalServiceTime = servedOrders.reduce((sum, order) => {
        const created = new Date(order.created_at).getTime();
        const served = new Date(order.served_at!).getTime();
        const diffMinutes = (served - created) / (1000 * 60);
        return sum + diffMinutes;
      }, 0);

      averageServiceTimeMinutes = Math.round(
        totalServiceTime / servedOrders.length,
      );
    }

    // Calculate total revenue from completed orders
    const totalRevenue = acceptedOrders
      .filter((o) => o.status === 'completed')
      .reduce((sum, order) => sum + Number(order.total), 0);

    // Get today's performance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = acceptedOrders.filter(
      (o) => new Date(o.created_at) >= today,
    );

    // Recent orders (last 10)
    const recentOrders = acceptedOrders.slice(0, 10).map((order) => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total: order.total,
      created_at: order.created_at,
      accepted_at: order.accepted_at,
      served_at: order.served_at,
    }));

    return {
      success: true,
      data: {
        waiter_id: waiterId,
        waiter_name: '', // TODO: Join with users table to get name
        today_stats: {
          orders_accepted: todayOrders.length,
          orders_rejected: 0, // TODO: Track per-waiter rejections
          orders_served: todayOrders.filter(
            (o) => o.status === 'served' || o.status === 'completed',
          ).length,
          average_service_time_minutes: averageServiceTimeMinutes,
        },
        week_stats: {
          total_orders: totalAccepted,
          acceptance_rate: parseFloat(
            totalAccepted > 0
              ? (
                  (totalAccepted / (totalAccepted + rejectedOrders)) *
                  100
                ).toFixed(2)
              : '0.00',
          ),
          rejection_rate: parseFloat(
            rejectedOrders > 0
              ? (
                  (rejectedOrders / (totalAccepted + rejectedOrders)) *
                  100
                ).toFixed(2)
              : '0.00',
          ),
          average_daily_orders: Math.round(totalAccepted / 7),
        },
        all_time_stats: {
          total_orders_served: totalServed,
          total_orders_accepted: totalAccepted,
          total_orders_rejected: rejectedOrders,
        },
      },
    };
  }

  /**
   * Get performance leaderboard for all waiters in a restaurant
   */
  async getLeaderboard(restaurantId: string, period: string = 'all') {
    // Calculate date filter based on period
    let dateFilter: Date | undefined;
    if (period === 'today') {
      dateFilter = new Date();
      dateFilter.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    }

    // Get all orders for the restaurant with waiter_id
    const whereClause: any = {
      restaurant_id: restaurantId,
      waiter_id: { not: null },
    };

    if (dateFilter) {
      whereClause.created_at = { gte: dateFilter };
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      select: {
        id: true,
        waiter_id: true,
        status: true,
        total: true,
        created_at: true,
        accepted_at: true,
        served_at: true,
      },
    });

    // Group by waiter_id and calculate stats
    const waiterStatsMap = new Map<string, any>();

    for (const order of orders) {
      const waiterId = order.waiter_id!;

      if (!waiterStatsMap.has(waiterId)) {
        waiterStatsMap.set(waiterId, {
          waiter_id: waiterId,
          total_orders: 0,
          accepted_orders: 0,
          served_orders: 0,
          completed_orders: 0,
          rejected_orders: 0,
          total_revenue: 0,
          total_service_time: 0,
          served_count: 0,
        });
      }

      const stats = waiterStatsMap.get(waiterId);
      stats.total_orders++;

      if (order.status === 'rejected') {
        stats.rejected_orders++;
      } else if (
        ['accepted', 'preparing', 'ready', 'served', 'completed'].includes(
          order.status,
        )
      ) {
        stats.accepted_orders++;

        if (order.status === 'served' || order.status === 'completed') {
          stats.served_orders++;
        }

        if (order.status === 'completed') {
          stats.completed_orders++;
          stats.total_revenue += Number(order.total);
        }

        // Calculate service time
        if (order.served_at && order.created_at) {
          const serviceTime =
            (new Date(order.served_at).getTime() -
              new Date(order.created_at).getTime()) /
            (1000 * 60);
          stats.total_service_time += serviceTime;
          stats.served_count++;
        }
      }
    }

    // Calculate final metrics and create leaderboard
    const leaderboard = Array.from(waiterStatsMap.values()).map((stats) => {
      const acceptanceRate =
        stats.total_orders > 0
          ? (stats.accepted_orders / stats.total_orders) * 100
          : 0;

      const averageServiceTime =
        stats.served_count > 0
          ? stats.total_service_time / stats.served_count
          : 0;

      return {
        waiter_id: stats.waiter_id,
        total_orders: stats.accepted_orders,
        orders_served: stats.served_orders,
        orders_completed: stats.completed_orders,
        acceptance_rate: Number(acceptanceRate.toFixed(2)),
        average_service_time: Number(averageServiceTime.toFixed(2)),
        total_revenue: stats.total_revenue,
      };
    });

    // Sort by total orders (accepted) descending, then by acceptance rate
    leaderboard.sort((a, b) => {
      if (b.total_orders !== a.total_orders) {
        return b.total_orders - a.total_orders;
      }
      return b.acceptance_rate - a.acceptance_rate;
    });

    // Add rank and format for frontend
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      waiter_id: entry.waiter_id,
      waiter_name: '', // TODO: Join with users table to get name
      orders_served: entry.orders_served,
      acceptance_rate: entry.acceptance_rate,
      average_service_time: entry.average_service_time,
      rank: index + 1,
    }));

    return {
      success: true,
      data: rankedLeaderboard,
    };
  }
}
