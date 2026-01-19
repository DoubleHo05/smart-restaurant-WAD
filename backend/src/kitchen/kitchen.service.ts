import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TablesService } from '../tables/tables.service';
import { KitchenOrdersFilterDto } from './dto/kitchen-orders-filter.dto';
import { BatchPrepareDto } from './dto/batch-prepare.dto';
import { DelayedOrdersFilterDto } from './dto/delayed-orders-filter.dto';

@Injectable()
export class KitchenService {
  constructor(
    private prisma: PrismaService,
    private tablesService: TablesService,
  ) {}

  /**
   * Get all orders that need kitchen attention (accepted & preparing status)
   * Kitchen staff can only see orders from their assigned restaurant
   */
  async getKitchenOrders(
    restaurantId: string,
    filters?: KitchenOrdersFilterDto,
  ) {
    const whereClause: any = {
      restaurant_id: restaurantId,
      status: {
        in: ['accepted', 'preparing', 'ready'], // Orders that kitchen needs to handle
      },
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
      orderBy: [
        { status: 'asc' }, // 'accepted' comes before 'preparing'
        { accepted_at: 'asc' }, // Oldest first
      ],
    });

    return {
      success: true,
      data: orders.map((order) => {
        // Calculate time elapsed since order was accepted
        const acceptedAt = order.accepted_at || order.created_at;
        const timeElapsed = Math.floor(
          (Date.now() - acceptedAt.getTime()) / 1000 / 60,
        ); // minutes

        // Calculate estimated prep time (sum of all items)
        const estimatedPrepTime = order.order_items.reduce(
          (total, item) =>
            total + (item.menu_item.prep_time_minutes || 0) * item.quantity,
          0,
        );

        // Calculate priority score (higher = more urgent)
        // Priority factors: time elapsed, estimated prep time, order items count
        const baseScore = timeElapsed;
        const itemComplexity = order.order_items.length;
        const priorityScore = baseScore + itemComplexity * 2;

        // Determine urgency level with configurable thresholds
        let urgency: 'normal' | 'warning' | 'critical' = 'normal';
        let delayMinutes = 0;
        if (estimatedPrepTime > 0) {
          delayMinutes = timeElapsed - estimatedPrepTime;
          const percentElapsed = (timeElapsed / estimatedPrepTime) * 100;
          if (percentElapsed > 100) {
            urgency = 'critical'; // Exceeded expected time
          } else if (percentElapsed > 75) {
            urgency = 'warning'; // Approaching deadline
          }
        } else {
          // No estimated prep time - use absolute time thresholds
          if (timeElapsed > 30) {
            urgency = 'critical';
          } else if (timeElapsed > 20) {
            urgency = 'warning';
          }
        }

        return {
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
          accepted_at: order.accepted_at,
          preparing_at: order.preparing_at,
          time_elapsed_minutes: timeElapsed,
          estimated_prep_time_minutes: estimatedPrepTime,
          urgency: urgency,
          priority_score: priorityScore,
          delay_minutes: delayMinutes,
          is_delayed: delayMinutes > 0,
          items: order.order_items
            .filter((item) => item.status !== 'REJECTED')
            .map((item) => ({
              id: item.id,
              name: item.menu_item.name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              prep_time_minutes: item.menu_item.prep_time_minutes,
              status: item.status,
              modifiers: item.modifiers.map((mod) => ({
                name: mod.modifier_option.name,
                price: mod.price_adjustment,
              })),
              special_requests: item.special_requests,
            })),
        };
      }),
      total: orders.length,
    };
  }

  /**
   * Kitchen starts preparing an order
   * Validates that the order belongs to the kitchen's restaurant
   */
  async startPreparing(
    orderId: string,
    restaurantId: string,
    kitchenStaffId: string,
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
        order_items: {
          include: {
            menu_item: {
              select: {
                name: true,
                prep_time_minutes: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Verify order belongs to kitchen's restaurant
    if (order.restaurant_id !== restaurantId) {
      throw new ForbiddenException(
        'You can only prepare orders from your restaurant',
      );
    }

    // Check if order is in accepted status
    if (order.status !== 'accepted') {
      throw new BadRequestException(
        `Order cannot be started. Current status: ${order.status}. Order must be in 'accepted' status.`,
      );
    }

    // Update order status to preparing
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'preparing',
        preparing_at: new Date(),
      },
    });

    // Calculate estimated completion time
    const estimatedPrepTime = order.order_items.reduce(
      (total, item) =>
        total + (item.menu_item.prep_time_minutes || 0) * item.quantity,
      0,
    );

    // TODO: Emit Socket.IO event to waiter (order_preparing)
    // TODO: Emit Socket.IO event to customer (order_preparing)

    // Auto-update table status (table remains occupied)
    await this.tablesService.autoUpdateTableStatusByOrder(orderId);

    return {
      success: true,
      message: 'Order preparation started',
      data: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        status: updatedOrder.status,
        table_number: order.table.table_number,
        preparing_at: updatedOrder.preparing_at,
        estimated_ready_at: new Date(
          updatedOrder.preparing_at!.getTime() + estimatedPrepTime * 60000,
        ),
        items: order.order_items
          .filter((item) => item.status !== 'REJECTED')
          .map((item) => ({
            name: item.menu_item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            prep_time: item.menu_item.prep_time_minutes,
            status: item.status,
          })),
      },
    };
  }

  /**
   * Kitchen marks order as ready (food is done)
   * Validates that the order belongs to the kitchen's restaurant
   */
  async markReady(
    orderId: string,
    restaurantId: string,
    kitchenStaffId: string,
  ) {
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

    // Verify order belongs to kitchen's restaurant
    if (order.restaurant_id !== restaurantId) {
      throw new ForbiddenException(
        'You can only mark orders as ready from your restaurant',
      );
    }

    // Check if order is in preparing status
    if (order.status !== 'preparing') {
      throw new BadRequestException(
        `Order cannot be marked as ready. Current status: ${order.status}. Order must be in 'preparing' status.`,
      );
    }

    // Calculate actual prep time
    const preparingAt =
      order.preparing_at || order.accepted_at || order.created_at;
    const actualPrepTime = Math.floor(
      (Date.now() - preparingAt.getTime()) / 1000 / 60,
    ); // minutes

    // Update order status to ready
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'ready',
        ready_at: new Date(),
      },
    });

    // TODO: Emit Socket.IO event to waiter (order_ready - high priority)
    // TODO: Emit Socket.IO event to customer (order_ready)

    // Auto-update table status (table remains occupied until served)
    await this.tablesService.autoUpdateTableStatusByOrder(orderId);

    return {
      success: true,
      message: 'Order marked as ready',
      data: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        status: updatedOrder.status,
        table_number: order.table.table_number,
        ready_at: updatedOrder.ready_at,
        actual_prep_time_minutes: actualPrepTime,
      },
    };
  }

  /**
   * Batch start preparing multiple orders
   * Allows kitchen to start preparing multiple orders at once (e.g., same table or similar items)
   */
  async batchStartPreparing(
    orderIds: string[],
    restaurantId: string,
    kitchenStaffId: string,
  ) {
    // Find all orders and verify they belong to the restaurant
    const orders = await this.prisma.order.findMany({
      where: {
        id: { in: orderIds },
        restaurant_id: restaurantId,
        status: 'accepted', // Only accept orders in 'accepted' status
      },
      include: {
        table: {
          select: {
            table_number: true,
          },
        },
        order_items: {
          include: {
            menu_item: {
              select: {
                name: true,
                prep_time_minutes: true,
              },
            },
          },
        },
      },
    });

    if (orders.length === 0) {
      throw new NotFoundException(
        'No valid orders found for batch preparation',
      );
    }

    // Verify all orders belong to the restaurant
    const invalidOrders = orders.filter(
      (order) => order.restaurant_id !== restaurantId,
    );
    if (invalidOrders.length > 0) {
      throw new ForbiddenException(
        'Some orders do not belong to your restaurant',
      );
    }

    // Update all orders to preparing status in a transaction
    const now = new Date();
    const updateResults = await this.prisma.$transaction(
      orders.map((order) =>
        this.prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'preparing',
            preparing_at: now,
          },
        }),
      ),
    );

    // Auto-update table status for all orders
    await Promise.all(
      orders.map((order) =>
        this.tablesService.autoUpdateTableStatusByOrder(order.id),
      ),
    );

    // Calculate total estimated prep time
    const totalEstimatedPrepTime = orders.reduce((total, order) => {
      const orderPrepTime = order.order_items.reduce(
        (sum, item) =>
          sum + (item.menu_item.prep_time_minutes || 0) * item.quantity,
        0,
      );
      return total + orderPrepTime;
    }, 0);

    // TODO: Emit Socket.IO event to waiters (batch_orders_preparing)
    // TODO: Emit Socket.IO event to customers (order_preparing)

    return {
      success: true,
      message: `Started preparing ${orders.length} orders`,
      data: {
        orders_started: orders.length,
        orders_skipped: orderIds.length - orders.length,
        total_estimated_prep_time_minutes: totalEstimatedPrepTime,
        estimated_ready_at: new Date(
          now.getTime() + totalEstimatedPrepTime * 60000,
        ),
        orders: updateResults.map((order, index) => ({
          id: order.id,
          order_number: order.order_number,
          table_number: orders[index].table.table_number,
          status: order.status,
          preparing_at: order.preparing_at,
        })),
      },
    };
  }

  /**
   * Get delayed orders that exceed their estimated prep time
   * Auto-alert feature for kitchen to prioritize
   */
  async getDelayedOrders(
    restaurantId: string,
    filters?: DelayedOrdersFilterDto,
  ) {
    const delayThreshold = filters?.delay_threshold_minutes || 0; // Default: any delay

    const whereClause: any = {
      restaurant_id: restaurantId,
      status: {
        in: ['accepted', 'preparing'], // Only active orders
      },
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
                  },
                },
              },
            },
          },
        },
      },
    });

    // Filter orders that are delayed
    const delayedOrders = orders
      .map((order) => {
        const acceptedAt = order.accepted_at || order.created_at;
        const timeElapsed = Math.floor(
          (Date.now() - acceptedAt.getTime()) / 1000 / 60,
        );

        const estimatedPrepTime = order.order_items.reduce(
          (total, item) =>
            total + (item.menu_item.prep_time_minutes || 0) * item.quantity,
          0,
        );

        const delayMinutes = timeElapsed - estimatedPrepTime;

        // Calculate priority score for sorting
        const itemComplexity = order.order_items.length;
        const priorityScore = timeElapsed + itemComplexity * 2;

        return {
          order,
          timeElapsed,
          estimatedPrepTime,
          delayMinutes,
          priorityScore,
        };
      })
      .filter((item) => item.delayMinutes > delayThreshold)
      .sort((a, b) => b.priorityScore - a.priorityScore); // Sort by priority (highest first)

    return {
      success: true,
      data: delayedOrders.map(
        ({
          order,
          timeElapsed,
          estimatedPrepTime,
          delayMinutes,
          priorityScore,
        }) => ({
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
          created_at: order.created_at,
          accepted_at: order.accepted_at,
          preparing_at: order.preparing_at,
          time_elapsed_minutes: timeElapsed,
          estimated_prep_time_minutes: estimatedPrepTime,
          delay_minutes: delayMinutes,
          priority_score: priorityScore,
          urgency: 'critical' as const,
          items: order.order_items
            .filter((item) => item.status !== 'REJECTED')
            .map((item) => ({
              id: item.id,
              name: item.menu_item.name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              prep_time_minutes: item.menu_item.prep_time_minutes,
              status: item.status,
              modifiers: item.modifiers.map((mod) => ({
                name: mod.modifier_option.name,
                price: mod.price_adjustment,
              })),
              special_requests: item.special_requests,
            })),
          special_requests: order.special_requests,
        }),
      ),
      total: delayedOrders.length,
      average_delay_minutes:
        delayedOrders.length > 0
          ? Math.round(
              delayedOrders.reduce((sum, item) => sum + item.delayMinutes, 0) /
                delayedOrders.length,
            )
          : 0,
    };
  }

  /**
   * Get kitchen performance statistics
   * Useful for analytics and reporting
   */
  async getKitchenStats(restaurantId: string, date?: Date) {
    const startOfDay = date ? new Date(date) : new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all completed orders for the day
    const completedOrders = await this.prisma.order.findMany({
      where: {
        restaurant_id: restaurantId,
        status: {
          in: ['ready', 'served', 'completed'],
        },
        preparing_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        preparing_at: true,
        ready_at: true,
        order_items: {
          include: {
            menu_item: {
              select: {
                prep_time_minutes: true,
              },
            },
          },
        },
      },
    });

    // Calculate average prep time
    const prepTimes = completedOrders
      .filter((order) => order.preparing_at && order.ready_at)
      .map((order) => {
        const prepTime = Math.floor(
          (order.ready_at!.getTime() - order.preparing_at!.getTime()) /
            1000 /
            60,
        );
        return prepTime;
      });

    const averagePrepTime =
      prepTimes.length > 0
        ? prepTimes.reduce((sum, time) => sum + time, 0) / prepTimes.length
        : 0;

    // Get orders currently in kitchen
    const activeOrders = await this.prisma.order.count({
      where: {
        restaurant_id: restaurantId,
        status: {
          in: ['accepted', 'preparing'],
        },
      },
    });

    return {
      success: true,
      data: {
        date: startOfDay,
        orders_completed: completedOrders.length,
        orders_active: activeOrders,
        average_prep_time_minutes: Math.round(averagePrepTime),
        prep_times: prepTimes,
      },
    };
  }
}
