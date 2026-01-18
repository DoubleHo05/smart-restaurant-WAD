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
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private notificationsGateway: NotificationsGateway,
    private notificationsService: NotificationsService,
  ) { }

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
      select: {
        id: true,
        name: true,
        price: true,
        status: true,
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('One or more menu items not found');
    }

    // Check if any items are unavailable
    const unavailableItems = menuItems.filter(
      (item) => item.status !== 'active',
    );
    if (unavailableItems.length > 0) {
      throw new BadRequestException(
        `Menu items are unavailable: ${unavailableItems.map((i) => i.name).join(', ')}`,
      );
    }

    // Create a map of menu items for quick lookup
    const menuItemMap = new Map<string, (typeof menuItems)[0]>(
      menuItems.map((item) => [item.id, item]),
    );

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

    // Clear the cart after successful order creation
    if (createDto.customer_id || createDto.session_id) {
      try {
        await this.cartService.clearCart(
          createDto.customer_id ?? null,
          createDto.session_id ?? '',
        );
      } catch (error) {
        // Log error but don't fail order creation if cart clearing fails
        console.error('Failed to clear cart after order creation:', error);
      }
    }

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
   * Complete an order
   * POST /api/orders/:id/complete
   * - Verify payment status (if payment system exists)
   * - Mark order as completed
   * - Release table status to available
   * - Archive the order
   */
  async completeOrder(orderId: string) {
    // Get order with full details
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        table: {
          select: {
            id: true,
            table_number: true,
            status: true,
            restaurant_id: true,
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

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Verify order is in correct state to be completed
    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Order is already completed');
    }

    if (
      order.status !== OrderStatus.SERVED &&
      order.status !== OrderStatus.READY
    ) {
      throw new BadRequestException(
        `Order must be in "served" or "ready" status to be completed. Current status: ${order.status}`,
      );
    }

    // TODO: Verify payment status when payment system is implemented
    // const payment = await this.prisma.payment.findFirst({
    //   where: { order_id: orderId },
    // });
    // if (!payment || payment.status !== 'completed') {
    //   throw new BadRequestException('Payment must be completed before order completion');
    // }

    const now = new Date();

    // Use transaction to ensure atomicity
    const result = await this.prisma.$transaction(async (tx: any) => {
      // 1. Update order status to completed
      const completedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.COMPLETED,
          completed_at: now,
          updated_at: now,
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

      // 2. Check if there are any other active orders for this table
      const activeOrdersCount = await tx.order.count({
        where: {
          table_id: order.table.id,
          status: {
            notIn: [
              OrderStatus.COMPLETED,
              OrderStatus.CANCELLED,
              OrderStatus.REJECTED,
            ],
          },
        },
      });

      // 3. Release table status to available if no other active orders
      if (activeOrdersCount === 0) {
        await tx.table.update({
          where: { id: order.table.id },
          data: {
            status: 'active', // Return table to active/available status
            updated_at: now,
          },
        });
      }

      return {
        completedOrder,
        tableReleased: activeOrdersCount === 0,
      };
    });

    // TODO: Emit Socket.IO event for order completion
    // this.notificationGateway.emitOrderCompleted({
    //   orderId: order.id,
    //   orderNumber: order.order_number,
    //   tableId: order.table.id,
    //   tableNumber: order.table.table_number,
    //   restaurantId: order.table.restaurant_id,
    // });

    return {
      message: 'Order completed successfully',
      order: result.completedOrder,
      tableReleased: result.tableReleased,
      tableId: order.table.id,
      tableNumber: order.table.table_number,
    };
  }

  /**
   * Get order history with filters (all orders except pending/preparing)
   * Supports filtering by date range, customer, table, and restaurant
   */
  async getOrderHistory(filters: {
    restaurant_id?: string;
    customer_id?: string;
    table_id?: string;
    start_date?: Date;
    end_date?: Date;
  }) {
    try {
      console.log('🔍 getOrderHistory called with filters:', filters);
      const where: any = {};

      // Multi-restaurant support
      if (filters.restaurant_id) {
        where.restaurant_id = filters.restaurant_id;
      }

      // Filter by customer
      if (filters.customer_id) {
        where.customer_id = filters.customer_id;
      }

      // Filter by table
      if (filters.table_id) {
        where.table_id = filters.table_id;
      }

      // Filter by date range
      if (filters.start_date || filters.end_date) {
        where.created_at = {};
        if (filters.start_date) {
          where.created_at.gte = filters.start_date;
        }
        if (filters.end_date) {
          // Set end date to end of day
          const endDate = new Date(filters.end_date);
          endDate.setHours(23, 59, 59, 999);
          where.created_at.lte = endDate;
        }
      }

      console.log('📊 Prisma where clause:', JSON.stringify(where, null, 2));

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          include: {
            table: {
              select: {
                id: true,
                table_number: true,
                capacity: true,
                restaurant_id: true,
                status: true,
              },
            },
            order_items: {
              include: {
                menu_item: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    category_id: true,
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 100, // Limit to 100 orders for performance
        }),
        this.prisma.order.count({ where }),
      ]);

      console.log(`✅ Found ${orders.length} orders out of ${total} total`);

      return {
        data: orders,
        total,
        filters: {
          restaurant_id: filters.restaurant_id,
          customer_id: filters.customer_id,
          table_id: filters.table_id,
          start_date: filters.start_date,
          end_date: filters.end_date,
        },
      };
    } catch (error) {
      console.error('❌ Error in getOrderHistory:', error);
      throw error;
    }
  }

  /**
   * Export order history to CSV format
   */
  async exportHistoryToCSV(filters: {
    restaurant_id?: string;
    customer_id?: string;
    table_id?: string;
    start_date?: Date;
    end_date?: Date;
  }): Promise<string> {
    const { data: orders } = await this.getOrderHistory(filters);

    // CSV Headers
    const headers = [
      'Order Number',
      'Date',
      'Time',
      'Restaurant ID',
      'Table Number',
      'Customer ID',
      'Items Count',
      'Total Amount',
      'Status',
      'Created At',
      'Completed At',
    ];

    // CSV Rows
    const rows = orders.map((order) => {
      const createdDate = new Date(order.created_at);
      const itemsCount = order.order_items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      return [
        order.order_number,
        createdDate.toLocaleDateString(),
        createdDate.toLocaleTimeString(),
        order.restaurant_id,
        order.table.table_number,
        order.customer_id || 'N/A',
        itemsCount,
        order.total.toFixed(2),
        order.status,
        createdDate.toISOString(),
        order.completed_at ? new Date(order.completed_at).toISOString() : 'N/A',
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape cells containing commas or quotes
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(','),
      ),
    ].join('\n');

    return csvContent;
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

  /**
   * Add items to an existing open order
   * Only allowed for orders with status: pending, accepted, preparing
   */
  async addItemsToOrder(orderId: string, items: any[]) {
    // Get existing order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Check if order is still open
    const openStatuses = ['pending', 'accepted', 'preparing'];
    if (!openStatuses.includes(order.status)) {
      throw new BadRequestException(
        `Cannot add items to order with status "${order.status}". Order must be pending, accepted, or preparing.`,
      );
    }

    // Validate menu items
    const menuItemIds = items.map((item) => item.menu_item_id);
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        is_deleted: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        status: true,
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException(
        'Some menu items are invalid or unavailable',
      );
    }

    const menuItemsMap = new Map<string, (typeof menuItems)[0]>(
      menuItems.map((item) => [item.id, item]),
    );

    // Validate modifiers
    const allModifierIds = items
      .flatMap((item) => item.modifiers || [])
      .map((mod) => mod.modifier_option_id);

    let modifierOptionsMap = new Map();
    if (allModifierIds.length > 0) {
      const modifierOptions = await this.prisma.modifierOption.findMany({
        where: {
          id: { in: allModifierIds },
          status: 'active',
        },
      });

      if (modifierOptions.length !== allModifierIds.length) {
        throw new BadRequestException(
          'Some modifier options are invalid or unavailable',
        );
      }

      modifierOptionsMap = new Map(modifierOptions.map((opt) => [opt.id, opt]));
    }

    // Calculate new items subtotal
    let additionalSubtotal = 0;
    const newItemsData: any[] = [];

    for (const item of items) {
      const menuItem = menuItemsMap.get(item.menu_item_id);
      if (!menuItem) {
        throw new BadRequestException(
          `Menu item ${item.menu_item_id} not found`,
        );
      }

      // Round item price to whole number first
      let itemSubtotal = Math.round(Number(menuItem.price)) * item.quantity;

      const modifiersData: any[] = [];
      if (item.modifiers && item.modifiers.length > 0) {
        for (const mod of item.modifiers) {
          const modOption = modifierOptionsMap.get(mod.modifier_option_id);
          if (modOption) {
            const priceAdjustment = Math.round(
              Number(modOption.price_adjustment),
            );
            itemSubtotal = itemSubtotal + priceAdjustment * item.quantity;
            modifiersData.push({
              modifier_option_id: mod.modifier_option_id,
              price_adjustment: modOption.price_adjustment,
            });
          }
        }
      }

      additionalSubtotal += itemSubtotal;

      newItemsData.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menuItem.price,
        subtotal: itemSubtotal,
        special_requests: item.special_requests,
        modifiers: modifiersData,
      });
    }

    // Calculate new totals - round to whole numbers for VND
    const newSubtotal = Number(order.subtotal) + additionalSubtotal;
    const newTax = Math.round(newSubtotal * 0.1);
    const newTotal = newSubtotal + newTax;

    // Add items in transaction
    const updatedOrder = await this.prisma.$transaction(async (tx: any) => {
      // Create new order items
      for (const itemData of newItemsData) {
        const { modifiers, ...orderItemFields } = itemData;

        const orderItem = await tx.orderItem.create({
          data: {
            order_id: orderId,
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

      // Update order totals
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          subtotal: newSubtotal,
          tax: newTax,
          total: newTotal,
        },
      });

      return updated;
    });

    return this.getOrderDetails(orderId);
  }
}
