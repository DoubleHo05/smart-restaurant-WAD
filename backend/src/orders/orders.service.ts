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

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

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
    return this.getOrderDetails(order.id);
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

    // TODO: Emit Socket.IO event for real-time notification (Sprint 2)
    // this.notificationGateway.emitOrderStatusUpdate({
    //   orderId: order.id,
    //   orderNumber: order.order_number,
    //   tableId: order.table_id,
    //   oldStatus: order.status,
    //   newStatus: updateDto.status,
    //   reason: updateDto.reason,
    // });

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
   * Get order history with filters (completed orders only)
   * Supports filtering by date range, customer, table, and restaurant
   */
  async getOrderHistory(filters: {
    restaurant_id?: string;
    customer_id?: string;
    table_id?: string;
    start_date?: Date;
    end_date?: Date;
  }) {
    const where: any = {
      status: OrderStatus.COMPLETED,
    };

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
      }),
      this.prisma.order.count({ where }),
    ]);

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
}
