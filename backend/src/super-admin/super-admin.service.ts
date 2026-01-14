import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfDay, endOfDay, subDays } from 'date-fns';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get system-wide statistics
   * GET /api/super-admin/stats
   */
  async getSystemStats() {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const last7Days = subDays(today, 7);

    // Parallel queries for performance
    const [
      totalRestaurants,
      activeRestaurants,
      totalUsers,
      activeUsers,
      usersByRole,
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      last7DaysRevenue,
      paymentStats,
    ] = await Promise.all([
      // Restaurants
      this.prisma.restaurant.count(),
      this.prisma.restaurant.count({
        where: { status: 'active' },
      }),

      // Users
      this.prisma.user.count({
        where: { is_deleted: false },
      }),
      this.prisma.user.count({
        where: { status: 'active', is_deleted: false },
      }),
      this.prisma.userRole.groupBy({
        by: ['role_id'],
        _count: { user_id: true },
      }),

      // Orders
      this.prisma.order.count(),
      this.prisma.order.count({
        where: {
          created_at: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
      }),

      // Revenue
      this.prisma.payment.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'completed',
          completed_at: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'completed',
          completed_at: {
            gte: last7Days,
          },
        },
        _sum: { amount: true },
      }),

      // Payment stats
      this.prisma.payment.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { amount: true },
      }),
    ]);

    // Get role names
    const roles = await this.prisma.role.findMany();
    const roleMap = new Map(roles.map((r) => [r.id, r.name]));

    const userDistribution = usersByRole.map((item) => ({
      role: roleMap.get(item.role_id) || 'unknown',
      count: item._count.user_id,
    }));

    // Calculate growth (compare with yesterday)
    const yesterdayOrders = await this.prisma.order.count({
      where: {
        created_at: {
          gte: startOfDay(yesterday),
          lte: endOfDay(yesterday),
        },
      },
    });

    const yesterdayRevenue = await this.prisma.payment.aggregate({
      where: {
        status: 'completed',
        completed_at: {
          gte: startOfDay(yesterday),
          lte: endOfDay(yesterday),
        },
      },
      _sum: { amount: true },
    });

    const ordersGrowth = yesterdayOrders
      ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
      : 0;

    const revenueGrowth =
      yesterdayRevenue._sum.amount && todayRevenue._sum.amount
        ? ((Number(todayRevenue._sum.amount) -
            Number(yesterdayRevenue._sum.amount)) /
            Number(yesterdayRevenue._sum.amount)) *
          100
        : 0;

    return {
      restaurants: {
        total: totalRestaurants,
        active: activeRestaurants,
        inactive: totalRestaurants - activeRestaurants,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        by_role: userDistribution,
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        growth_vs_yesterday: ordersGrowth.toFixed(2) + '%',
      },
      revenue: {
        total: Number(totalRevenue._sum.amount || 0),
        today: Number(todayRevenue._sum.amount || 0),
        last_7_days: Number(last7DaysRevenue._sum.amount || 0),
        growth_vs_yesterday: revenueGrowth.toFixed(2) + '%',
      },
      payments: {
        by_status: paymentStats.map((item) => ({
          status: item.status,
          count: item._count.id,
          amount: Number(item._sum.amount || 0),
        })),
      },
    };
  }

  /**
   * Get all restaurants with statistics
   * GET /api/super-admin/restaurants
   */
  async getAllRestaurantsWithStats() {
    const restaurants = await this.prisma.restaurant.findMany({
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            full_name: true,
            status: true,
          },
        },
        _count: {
          select: {
            tables: true,
            menu_categories: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Get additional stats for each restaurant
    const restaurantsWithStats = await Promise.all(
      restaurants.map(async (restaurant) => {
        const [orderCount, revenue, activeMenuItems] = await Promise.all([
          this.prisma.order.count({
            where: { restaurant_id: restaurant.id },
          }),
          this.prisma.order.aggregate({
            where: {
              restaurant_id: restaurant.id,
              status: 'completed',
            },
            _sum: { total: true },
          }),
          this.prisma.menuItem.count({
            where: {
              restaurant_id: restaurant.id,
              status: 'available',
              is_deleted: false,
            },
          }),
        ]);

        return {
          ...restaurant,
          stats: {
            total_orders: orderCount,
            total_revenue: Number(revenue._sum.total || 0),
            tables_count: restaurant._count.tables,
            categories_count: restaurant._count.menu_categories,
            active_menu_items: activeMenuItems,
          },
        };
      }),
    );

    return restaurantsWithStats;
  }

  /**
   * Get restaurant details with full statistics
   * GET /api/super-admin/restaurants/:id
   */
  async getRestaurantDetails(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            full_name: true,
            phone: true,
            status: true,
          },
        },
        tables: true,
        menu_categories: {
          include: {
            _count: {
              select: {
                menu_items: true,
              },
            },
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant ${restaurantId} not found`);
    }

    // Get detailed statistics
    const [
      totalOrders,
      completedOrders,
      totalRevenue,
      averageOrderValue,
      topSellingItems,
    ] = await Promise.all([
      this.prisma.order.count({
        where: { restaurant_id: restaurantId },
      }),
      this.prisma.order.count({
        where: {
          restaurant_id: restaurantId,
          status: 'completed',
        },
      }),
      this.prisma.order.aggregate({
        where: {
          restaurant_id: restaurantId,
          status: 'completed',
        },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: {
          restaurant_id: restaurantId,
          status: 'completed',
        },
        _avg: { total: true },
      }),
      this.prisma.orderItem.groupBy({
        by: ['menu_item_id'],
        where: {
          order: {
            restaurant_id: restaurantId,
            status: { in: ['completed', 'served'] },
          },
        },
        _sum: {
          quantity: true,
          subtotal: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Get menu item details for top selling
    const topSellingWithDetails = await Promise.all(
      topSellingItems.map(async (item) => {
        const menuItem = await this.prisma.menuItem.findUnique({
          where: { id: item.menu_item_id },
          select: {
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
          name: menuItem?.name,
          category: menuItem?.category.name,
          total_sold: item._sum.quantity,
          revenue: Number(item._sum.subtotal || 0),
        };
      }),
    );

    return {
      ...restaurant,
      statistics: {
        orders: {
          total: totalOrders,
          completed: completedOrders,
          completion_rate:
            totalOrders > 0
              ? ((completedOrders / totalOrders) * 100).toFixed(2) + '%'
              : '0%',
        },
        revenue: {
          total: Number(totalRevenue._sum.total || 0),
          average_order_value: Number(averageOrderValue._avg.total || 0),
        },
        menu: {
          total_categories: restaurant.menu_categories.length,
          total_items: restaurant.menu_categories.reduce(
            (sum, cat) => sum + cat._count.menu_items,
            0,
          ),
        },
        top_selling_items: topSellingWithDetails,
      },
    };
  }
}
