import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  startOfDay,
  endOfDay,
  subDays,
  format,
  differenceInMinutes,
} from 'date-fns';
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

  /**
   * Revenue by Category (Task 3.4)
   * GET /api/reports/revenue-by-category
   */
  async getRevenueByCategory(
    restaurantId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate) : new Date();

    const result = await this.prisma.orderItem.groupBy({
      by: ['menu_item_id'],
      where: {
        order: {
          restaurant_id: restaurantId,
          status: { in: [OrderStatus.completed, OrderStatus.served] },
          created_at: {
            gte: start,
            lte: end,
          },
        },
      },
      _sum: {
        subtotal: true,
        quantity: true,
      },
    });

    // Get category information for each item
    const revenueByCategory = new Map<
      string,
      { revenue: number; quantity: number; items: string[] }
    >();

    for (const item of result) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menu_item_id },
        select: {
          name: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (menuItem && menuItem.category) {
        const categoryName = menuItem.category.name;
        const current = revenueByCategory.get(categoryName) || {
          revenue: 0,
          quantity: 0,
          items: [],
        };

        current.revenue += Number(item._sum.subtotal || 0);
        current.quantity += Number(item._sum.quantity || 0);
        if (!current.items.includes(menuItem.name)) {
          current.items.push(menuItem.name);
        }

        revenueByCategory.set(categoryName, current);
      }
    }

    // Convert Map to array
    const categoryStats = Array.from(revenueByCategory.entries()).map(
      ([name, data]) => ({
        category: name,
        revenue: data.revenue,
        quantity: data.quantity,
        items_count: data.items.length,
      }),
    );

    // Sort by revenue descending
    categoryStats.sort((a, b) => b.revenue - a.revenue);

    return {
      period: {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
      },
      categories: categoryStats,
      total_revenue: categoryStats.reduce((sum, cat) => sum + cat.revenue, 0),
    };
  }

  /**
   * Waiter Performance Tracking (Task 3.4)
   * GET /api/reports/waiter-performance
   */
  async getWaiterPerformance(
    restaurantId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate) : new Date();

    try {
      // Get all orders with waiter info
      const orders = await this.prisma.order.findMany({
        where: {
          restaurant_id: restaurantId,
          waiter_id: { not: null },
          status: { in: [OrderStatus.completed, OrderStatus.served] },
          created_at: {
            gte: start,
            lte: end,
          },
        },
        include: {
          waiter: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
      });

      // Group by waiter
      const waiterStats = new Map<
        string,
        {
          name: string;
          email: string;
          orders: number;
          revenue: number;
          avg_order_value: number;
        }
      >();

      for (const order of orders) {
        if (!order.waiter) continue;

        const waiterId = order.waiter.id;
        const current = waiterStats.get(waiterId) || {
          name: order.waiter.full_name || 'Unknown',
          email: order.waiter.email,
          orders: 0,
          revenue: 0,
          avg_order_value: 0,
        };

        current.orders += 1;
        current.revenue += Number(order.total);

        waiterStats.set(waiterId, current);
      }

      // Calculate averages
      const performanceList = Array.from(waiterStats.values()).map((waiter) => ({
        ...waiter,
        avg_order_value: waiter.orders > 0 ? waiter.revenue / waiter.orders : 0,
      }));

      // Sort by revenue
      performanceList.sort((a, b) => b.revenue - a.revenue);

      return {
        period: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        },
        waiters: performanceList,
        total_waiters: performanceList.length,
        total_revenue: performanceList.reduce((sum, w) => sum + w.revenue, 0),
      };
    } catch (error) {
      // If waiter_id column doesn't exist or relation error, return empty data
      console.warn('Waiter performance query failed:', error.message);
      return {
        period: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        },
        waiters: [],
        total_waiters: 0,
        total_revenue: 0,
      };
    }
  }

  /**
   * Kitchen Efficiency Analysis (Task 3.4)
   * GET /api/reports/kitchen-efficiency
   */
  async getKitchenEfficiency(
    restaurantId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : subDays(new Date(), 7);
    const end = endDate ? new Date(endDate) : new Date();

    // Get orders with status timestamps
    const orders = await this.prisma.order.findMany({
      where: {
        restaurant_id: restaurantId,
        status: {
          in: [OrderStatus.ready, OrderStatus.served, OrderStatus.completed],
        },
        created_at: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        status: true,
      },
    });

    if (orders.length === 0) {
      return {
        period: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        },
        average_prep_time_minutes: 0,
        total_orders: 0,
        orders_by_prep_time: [],
      };
    }

    // Calculate preparation time (from created to updated)
    const prepTimes = orders.map((order) =>
      differenceInMinutes(order.updated_at, order.created_at),
    );

    const avgPrepTime =
      prepTimes.reduce((sum, time) => sum + time, 0) / prepTimes.length;

    // Group by time ranges
    const timeRanges = {
      '0-10': 0,
      '10-20': 0,
      '20-30': 0,
      '30+': 0,
    };

    prepTimes.forEach((time) => {
      if (time <= 10) timeRanges['0-10']++;
      else if (time <= 20) timeRanges['10-20']++;
      else if (time <= 30) timeRanges['20-30']++;
      else timeRanges['30+']++;
    });

    return {
      period: {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
      },
      average_prep_time_minutes: Math.round(avgPrepTime),
      total_orders: orders.length,
      orders_by_prep_time: [
        { range: '0-10 minutes', count: timeRanges['0-10'] },
        { range: '10-20 minutes', count: timeRanges['10-20'] },
        { range: '20-30 minutes', count: timeRanges['20-30'] },
        { range: '30+ minutes', count: timeRanges['30+'] },
      ],
    };
  }

  /**
   * Customer Retention Analysis (Task 3.4)
   * GET /api/reports/customer-retention
   */
  async getCustomerRetention(
    restaurantId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : subDays(new Date(), 90);
    const end = endDate ? new Date(endDate) : new Date();

    // Get orders grouped by customer_id
    const orders = await this.prisma.order.findMany({
      where: {
        restaurant_id: restaurantId,
        customer_id: { not: null },
        created_at: {
          gte: start,
          lte: end,
        },
      },
      select: {
        customer_id: true,
        created_at: true,
        total: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    // Group by customer
    const customerData = new Map<
      string,
      {
        orders: number;
        total_spent: number;
        first_order: Date;
        last_order: Date;
      }
    >();

    for (const order of orders) {
      const customerId = order.customer_id!;
      const current = customerData.get(customerId) || {
        orders: 0,
        total_spent: 0,
        first_order: order.created_at,
        last_order: order.created_at,
      };

      current.orders += 1;
      current.total_spent += Number(order.total);
      if (order.created_at < current.first_order) {
        current.first_order = order.created_at;
      }
      if (order.created_at > current.last_order) {
        current.last_order = order.created_at;
      }

      customerData.set(customerId, current);
    }

    // Categorize customers
    const newCustomers = Array.from(customerData.values()).filter(
      (c) => c.orders === 1,
    );
    const returningCustomers = Array.from(customerData.values()).filter(
      (c) => c.orders > 1,
    );
    const loyalCustomers = Array.from(customerData.values()).filter(
      (c) => c.orders >= 5,
    );

    // Top customers by spending
    const topCustomers = Array.from(customerData.entries())
      .map(([customer_id, data]) => ({
        customer_id,
        orders: data.orders,
        total_spent: data.total_spent,
      }))
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 10);

    return {
      period: {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
      },
      summary: {
        total_customers: customerData.size,
        new_customers: newCustomers.length,
        returning_customers: returningCustomers.length,
        loyal_customers: loyalCustomers.length,
        retention_rate:
          customerData.size > 0
            ? ((returningCustomers.length / customerData.size) * 100).toFixed(
                2,
              ) + '%'
            : '0%',
      },
      top_customers: topCustomers,
      average_orders_per_customer:
        customerData.size > 0
          ? (orders.length / customerData.size).toFixed(2)
          : '0',
    };
  }

  /**
   * Peak Hours Analysis (Task 3.4)
   * GET /api/reports/peak-hours
   */
  async getPeakHours(
    restaurantId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate) : new Date();

    const orders = await this.prisma.order.findMany({
      where: {
        restaurant_id: restaurantId,
        created_at: {
          gte: start,
          lte: end,
        },
      },
      select: {
        created_at: true,
        total: true,
      },
    });

    // Group by hour
    const hourlyStats = new Map<number, { orders: number; revenue: number }>();

    for (const order of orders) {
      const hour = order.created_at.getHours();
      const current = hourlyStats.get(hour) || { orders: 0, revenue: 0 };

      current.orders += 1;
      current.revenue += Number(order.total);

      hourlyStats.set(hour, current);
    }

    // Convert to array
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const stats = hourlyStats.get(hour) || { orders: 0, revenue: 0 };
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        orders: stats.orders,
        revenue: stats.revenue,
      };
    });

    // Find peak hour
    const peakHour = hourlyData.reduce((max, current) =>
      current.orders > max.orders ? current : max,
    );

    return {
      period: {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
      },
      peak_hour: peakHour,
      hourly_breakdown: hourlyData,
    };
  }
}
