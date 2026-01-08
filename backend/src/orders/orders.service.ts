import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
}
