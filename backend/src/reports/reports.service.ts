import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get daily revenue for date range
   */
  async getDailyRevenue(restaurantId: string, startDate: Date, endDate: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        restaurant_id: restaurantId,
        status: {
          in: [OrderStatus.completed],
        },
        created_at: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      select: {
        created_at: true,
        total: true,
        subtotal: true,
        tax: true,
      },
    });

    // Group by date
    const revenueByDate = orders.reduce((acc, order) => {
      const date = format(order.created_at, 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          date,
          total_revenue: 0,
          total_orders: 0,
          subtotal: 0,
          tax: 0,
        };
      }
      acc[date].total_revenue += Number(order.total);
      acc[date].subtotal += Number(order.subtotal);
      acc[date].tax += Number(order.tax);
      acc[date].total_orders += 1;
      return acc;
    }, {});

    return Object.values(revenueByDate).sort((a: any, b: any) =>
      a.date.localeCompare(b.date),
    );
  }

  /**
   * Get popular items (top-selling)
   */
  async getPopularItems(restaurantId: string, limit = 10, days = 30) {
    const startDate = subDays(new Date(), days);

    const popularItems = await this.prisma.orderItem.groupBy({
      by: ['menu_item_id'],
      where: {
        order: {
          restaurant_id: restaurantId,
          status: {
            in: [OrderStatus.completed, OrderStatus.served],
          },
          created_at: {
            gte: startDate,
          },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    // Fetch menu item details
    const itemsWithDetails = await Promise.all(
      popularItems.map(async (item) => {
        const menuItem = await this.prisma.menuItem.findUnique({
          where: { id: item.menu_item_id },
          select: {
            id: true,
            name: true,
            price: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        });

        return {
          menu_item_id: item.menu_item_id,
          name: menuItem?.name,
          category: menuItem?.category.name,
          total_quantity: item._sum.quantity,
          total_revenue: item._sum.subtotal,
          times_ordered: item._count.id,
        };
      }),
    );

    return itemsWithDetails;
  }

  /**
   * Get orders grouped by status
   */
  async getOrdersByStatus(
    restaurantId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const whereClause: any = {
      restaurant_id: restaurantId,
    };

    if (startDate && endDate) {
      whereClause.created_at = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      };
    }

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    });

    return ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count.id,
      total_revenue: item._sum.total || 0,
    }));
  }

  /**
   * Get average preparation time
   */
  async getAveragePrepTime(restaurantId: string, days = 7) {
    const startDate = subDays(new Date(), days);

    const completedOrders = await this.prisma.order.findMany({
      where: {
        restaurant_id: restaurantId,
        status: {
          in: [OrderStatus.completed, OrderStatus.served],
        },
        created_at: {
          gte: startDate,
        },
        accepted_at: { not: null },
        ready_at: { not: null },
      },
      select: {
        accepted_at: true,
        ready_at: true,
      },
    });

    if (completedOrders.length === 0) {
      return { average_prep_time_minutes: 0, orders_analyzed: 0 };
    }

    const totalPrepTime = completedOrders.reduce((sum, order) => {
      if (order.accepted_at && order.ready_at) {
        const prepTime =
          (order.ready_at.getTime() - order.accepted_at.getTime()) / 1000 / 60;
        return sum + prepTime;
      }
      return sum;
    }, 0);

    return {
      average_prep_time_minutes: Math.round(
        totalPrepTime / completedOrders.length,
      ),
      orders_analyzed: completedOrders.length,
    };
  }

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(restaurantId: string) {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    // Today's revenue
    const todayOrders = await this.prisma.order.aggregate({
      where: {
        restaurant_id: restaurantId,
        status: OrderStatus.completed,
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
    });

    // Pending orders count
    const pendingOrders = await this.prisma.order.count({
      where: {
        restaurant_id: restaurantId,
        status: OrderStatus.pending,
      },
    });

    // Orders in preparation
    const preparingOrders = await this.prisma.order.count({
      where: {
        restaurant_id: restaurantId,
        status: {
          in: [OrderStatus.accepted, OrderStatus.preparing],
        },
      },
    });

    // Ready to serve
    const readyOrders = await this.prisma.order.count({
      where: {
        restaurant_id: restaurantId,
        status: OrderStatus.ready,
      },
    });

    return {
      today_revenue: todayOrders._sum.total || 0,
      today_orders_count: todayOrders._count.id,
      pending_orders: pendingOrders,
      preparing_orders: preparingOrders,
      ready_orders: readyOrders,
    };
  }
}
