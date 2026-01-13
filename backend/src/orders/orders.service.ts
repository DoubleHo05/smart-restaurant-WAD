import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  UpdateOrderStatusDto,
  OrderStatus,
} from './dto/update-order-status.dto';

import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Create a new order with items and modifiers
   */
  async create(createDto: CreateOrderDto) {
    // Validate table exists and is active
    const table = await this.prisma.table.findUnique({
      where: { id: createDto.table_id },
    });

    if (!table) {
      throw new NotFoundException(
        `Table with ID ${createDto.table_id} not found`,
      );
    }

    if (table.status !== 'active') {
      throw new BadRequestException('Table is not active');
    }

    // Validate all menu items exist and are available
    const menuItemIds = createDto.items.map((item) => item.menu_item_id);
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurant_id: createDto.restaurant_id,
        is_deleted: false,
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('One or more menu items not found');
    }

    // Check if any items are unavailable
    const unavailableItems = menuItems.filter(
      (item) => item.status !== 'available',
    );
    if (unavailableItems.length > 0) {
      throw new BadRequestException(
        `Menu items are unavailable: ${unavailableItems.map((i) => i.name).join(', ')}`,
      );
    }

    // Create a map of menu items for quick lookup
    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

    // Validate and collect all modifier option IDs
    const allModifierOptionIds = createDto.items
      .flatMap((item) => item.modifiers || [])
      .map((mod) => mod.modifier_option_id);

    let modifierOptionsMap = new Map();
    if (allModifierOptionIds.length > 0) {
      const modifierOptions = await this.prisma.modifierOption.findMany({
        where: {
          id: { in: allModifierOptionIds },
          status: 'active',
        },
      });

      if (modifierOptions.length !== allModifierOptionIds.length) {
        throw new BadRequestException(
          'One or more modifier options not found or inactive',
        );
      }

      modifierOptionsMap = new Map(modifierOptions.map((opt) => [opt.id, opt]));
    }

    // Generate order number (format: ORD-YYYYMMDD-XXXX)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    // Calculate order totals
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of createDto.items) {
      const menuItem = menuItemMap.get(item.menu_item_id);
      if (!menuItem) continue;

      let itemSubtotal = Number(menuItem.price) * item.quantity;

      // Add modifier costs
      const modifiersData: any[] = [];
      if (item.modifiers && item.modifiers.length > 0) {
        for (const mod of item.modifiers) {
          const modOption = modifierOptionsMap.get(mod.modifier_option_id);
          if (modOption) {
            const priceAdjustment = Number(modOption.price_adjustment);
            itemSubtotal = itemSubtotal + priceAdjustment * item.quantity;
            modifiersData.push({
              modifier_option_id: mod.modifier_option_id,
              price_adjustment: modOption.price_adjustment,
            });
          }
        }
      }

      subtotal = subtotal + itemSubtotal;

      orderItemsData.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menuItem.price,
        subtotal: itemSubtotal,
        special_requests: item.special_requests,
        modifiers: modifiersData,
      });
    }

    // Calculate tax (10% - can be configurable)
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Create order with items and modifiers in a transaction
    const order = await this.prisma.$transaction(async (tx: any) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          restaurant_id: createDto.restaurant_id,
          table_id: createDto.table_id,
          customer_id: createDto.customer_id,
          order_number: orderNumber,
          status: 'pending',
          subtotal,
          tax,
          total,
          special_requests: createDto.special_requests,
        },
      });

      // Create order items with modifiers
      for (const itemData of orderItemsData) {
        const { modifiers, ...orderItemFields } = itemData;

        const orderItem = await tx.orderItem.create({
          data: {
            order_id: newOrder.id,
            ...orderItemFields,
          },
        });

        // Create order item modifiers
        if (modifiers && modifiers.length > 0) {
          await tx.orderItemModifier.createMany({
            data: modifiers.map((mod) => ({
              order_item_id: orderItem.id,
              modifier_option_id: mod.modifier_option_id,
              price_adjustment: mod.price_adjustment,
            })),
          });
        }
      }

      return newOrder;
    });

    // Return the complete order with items and modifiers
    const completeOrder = await this.getOrderDetails(order.id);

    // 🔔 EMIT REAL-TIME NOTIFICATION TO WAITERS
    await this.notifyNewOrder(completeOrder);

    return completeOrder;
  }

  /**
   * Get complete order details with items and modifiers
   */
  async getOrderDetails(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
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
                description: true,
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
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  /**
   * Get all orders with optional filters
   * For Admin/Waiter - list all orders
   */
  async findAll(filters?: {
    status?: string;
    table_id?: string;
    customer_id?: string;
    restaurant_id?: string;
    start_date?: Date;
    end_date?: Date;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.table_id) {
      where.table_id = filters.table_id;
    }

    if (filters?.customer_id) {
      where.customer_id = filters.customer_id;
    }

    if (filters?.restaurant_id) {
      where.restaurant_id = filters.restaurant_id;
    }

    if (filters?.start_date || filters?.end_date) {
      where.created_at = {};
      if (filters.start_date) {
        where.created_at.gte = filters.start_date;
      }
      if (filters.end_date) {
        where.created_at.lte = filters.end_date;
      }
    }

    const orders = await this.prisma.order.findMany({
      where,
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
        created_at: 'desc',
      },
    });

    return {
      data: orders,
      total: orders.length,
    };
  }

  /**
   * Get orders by table ID
   */
  async findByTableId(tableId: string) {
    const orders = await this.prisma.order.findMany({
      where: { table_id: tableId },
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
        created_at: 'desc',
      },
    });

    return {
      data: orders,
      total: orders.length,
    };
  }

  /**
   * Get customer order history
   */
  async findByCustomerId(customerId: string) {
    const orders = await this.prisma.order.findMany({
      where: { customer_id: customerId },
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
        created_at: 'desc',
      },
    });

    return {
      data: orders,
      total: orders.length,
    };
  }

  /**
   * Validate status transition
   * Ensures order status follows valid state machine flow
   */
  private validateStatusTransition(
    currentStatus: string,
    newStatus: OrderStatus,
  ): boolean {
    const validTransitions: Record<string, OrderStatus[]> = {
      pending: [
        OrderStatus.ACCEPTED,
        OrderStatus.REJECTED,
        OrderStatus.CANCELLED,
      ],
      accepted: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      preparing: [OrderStatus.READY, OrderStatus.CANCELLED],
      ready: [OrderStatus.SERVED, OrderStatus.CANCELLED],
      served: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      completed: [], // Terminal state
      cancelled: [], // Terminal state
      rejected: [], // Terminal state
    };

    const allowedStatuses = validTransitions[currentStatus] || [];
    return allowedStatuses.includes(newStatus);
  }

  /**
   * Update order status with validation
   * PATCH /api/orders/:id/status
   */
  async updateStatus(orderId: string, updateDto: UpdateOrderStatusDto) {
    // Get current order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        order_number: true,
        status: true,
        table_id: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Validate status transition
    if (!this.validateStatusTransition(order.status, updateDto.status)) {
      throw new BadRequestException(
        `Invalid status transition from "${order.status}" to "${updateDto.status}"`,
      );
    }

    // Prepare update data with timestamps
    const updateData: any = {
      status: updateDto.status,
      updated_at: new Date(),
    };

    // Set timestamp fields based on new status
    const now = new Date();
    switch (updateDto.status) {
      case OrderStatus.ACCEPTED:
        updateData.accepted_at = now;
        break;
      case OrderStatus.PREPARING:
        updateData.preparing_at = now;
        break;
      case OrderStatus.READY:
        updateData.ready_at = now;
        break;
      case OrderStatus.SERVED:
        updateData.served_at = now;
        break;
      case OrderStatus.COMPLETED:
        updateData.completed_at = now;
        break;
    }

    // Update order in database
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
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
                price: true,
              },
            },
          },
        },
      },
    });

    // 🔔 EMIT REAL-TIME NOTIFICATIONS based on new status
    await this.emitStatusChangeNotification(
      updatedOrder,
      order.status,
      updateDto,
    );

    return {
      message: `Order status updated from "${order.status}" to "${updateDto.status}"`,
      order: updatedOrder,
    };
  }

  /**
   * 🔔 Notify waiters about new order
   */
  private async notifyNewOrder(order: any) {
    const notification = {
      type: 'new_order',
      title: 'New Order Received',
      message: `New order #${order.order_number} from Table ${order.table.table_number}`,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        table_number: order.table.table_number,
        total: Number(order.total),
        items_count: order.order_items.length,
      },
      timestamp: new Date().toISOString(),
    };

    // Emit to all waiters via WebSocket
    this.notificationsGateway.emitToRole('waiter', 'new_order', notification);

    // Also notify admins
    this.notificationsGateway.emitToRole('admin', 'new_order', notification);

    // Save notification to database for all waiters
    const waiters = await this.prisma.user.findMany({
      where: {
        user_roles: {
          some: {
            role: { name: 'waiter' },
          },
        },
        status: 'active',
      },
      select: { id: true },
    });

    // Save notifications in bulk
    for (const waiter of waiters) {
      await this.notificationsService.createNotification({
        user_id: waiter.id,
        type: 'new_order',
        title: 'New Order',
        message: `Order #${order.order_number} from Table ${order.table.table_number}`,
        data: { order_id: order.id },
      });
    }

    console.log(
      `✅ Notified ${waiters.length} waiters about order ${order.order_number}`,
    );
  }

  /**
   * 🔔 Emit notification based on status change
   */
  private async emitStatusChangeNotification(
    order: any,
    oldStatus: string,
    updateDto: UpdateOrderStatusDto,
  ) {
    switch (updateDto.status) {
      case OrderStatus.ACCEPTED:
        await this.notifyOrderAccepted(order);
        break;
      case OrderStatus.READY:
        await this.notifyOrderReady(order);
        break;
      case OrderStatus.SERVED:
        await this.notifyOrderServed(order);
        break;
      case OrderStatus.REJECTED:
        await this.notifyOrderRejected(
          order,
          updateDto.reason || 'No reason provided',
        );
        break;
      case OrderStatus.CANCELLED:
        await this.notifyOrderCancelled(
          order,
          updateDto.reason || 'Cancelled by request',
        );
        break;
    }
  }

  /**
   * 🔔 Notify kitchen when order is accepted
   */
  private async notifyOrderAccepted(order: any) {
    const notification = {
      type: 'order_accepted',
      title: 'Order Accepted',
      message: `Order #${order.order_number} accepted - Start preparing`,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        table_number: order.table.table_number,
        items: order.order_items.map((item: any) => ({
          name: item.menu_item.name,
          quantity: item.quantity,
        })),
      },
      timestamp: new Date().toISOString(),
    };

    // Emit to kitchen staff
    this.notificationsGateway.emitToRole(
      'kitchen',
      'order_accepted',
      notification,
    );

    // Notify customer if exists
    if (order.customer_id) {
      this.notificationsGateway.emitToUser(
        order.customer_id,
        'order_status_update',
        {
          order_id: order.id,
          status: 'accepted',
          message: 'Your order has been accepted and is being prepared',
        },
      );
    }

    console.log(`✅ Notified kitchen: Order ${order.order_number} accepted`);
  }

  /**
   * 🔔 Notify waiter when order is ready
   */
  private async notifyOrderReady(order: any) {
    const notification = {
      type: 'order_ready',
      title: 'Order Ready',
      message: `Order #${order.order_number} is ready to serve`,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        table_number: order.table.table_number,
      },
      timestamp: new Date().toISOString(),
    };

    // Emit to waiters
    this.notificationsGateway.emitToRole('waiter', 'order_ready', notification);

    // Notify customer
    if (order.customer_id) {
      this.notificationsGateway.emitToUser(
        order.customer_id,
        'order_status_update',
        {
          order_id: order.id,
          status: 'ready',
          message: 'Your order is ready!',
        },
      );
    }

    console.log(`✅ Notified waiter: Order ${order.order_number} ready`);
  }

  /**
   * 🔔 Notify customer when order is served
   */
  private async notifyOrderServed(order: any) {
    if (order.customer_id) {
      this.notificationsGateway.emitToUser(
        order.customer_id,
        'order_status_update',
        {
          order_id: order.id,
          status: 'served',
          message: 'Your order has been served. Enjoy your meal!',
          timestamp: new Date().toISOString(),
        },
      );
    }

    console.log(`✅ Notified customer: Order ${order.order_number} served`);
  }

  /**
   * 🔔 Notify about order rejection
   */
  private async notifyOrderRejected(order: any, reason: string) {
    const notification = {
      type: 'order_rejected',
      title: 'Order Rejected',
      message: `Order #${order.order_number} was rejected`,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        reason,
      },
      timestamp: new Date().toISOString(),
    };

    // Notify customer
    if (order.customer_id) {
      this.notificationsGateway.emitToUser(
        order.customer_id,
        'order_rejected',
        notification,
      );
    }

    // Notify admins
    this.notificationsGateway.emitToRole(
      'admin',
      'order_rejected',
      notification,
    );

    console.log(`❌ Notified: Order ${order.order_number} rejected`);
  }

  /**
   * 🔔 Notify about order cancellation
   */
  private async notifyOrderCancelled(order: any, reason: string) {
    const notification = {
      type: 'order_cancelled',
      title: 'Order Cancelled',
      message: `Order #${order.order_number} was cancelled`,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        reason,
      },
      timestamp: new Date().toISOString(),
    };

    // Notify customer
    if (order.customer_id) {
      this.notificationsGateway.emitToUser(
        order.customer_id,
        'order_cancelled',
        notification,
      );
    }

    console.log(`⚠️ Notified: Order ${order.order_number} cancelled`);
  }
}
