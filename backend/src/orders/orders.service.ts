import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  UpdateOrderStatusDto,
  OrderStatus,
} from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
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
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('One or more menu items not found');
    }

    // Check if any items are unavailable (accept both 'available' and 'active' status)
    const unavailableItems = menuItems.filter(
      (item) => item.status !== 'available' && item.status !== 'active',
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

    console.log('🔍 Validating modifier options...');
    console.log('📋 Requested IDs:', allModifierOptionIds);
    console.log('📊 Total requested:', allModifierOptionIds.length);

    let modifierOptionsMap = new Map();
    if (allModifierOptionIds.length > 0) {
      const modifierOptions = await this.prisma.modifierOption.findMany({
        where: {
          id: { in: allModifierOptionIds },
        },
      });

      console.log('✅ Found in database:', modifierOptions.length);
      console.log('📦 Found options:', modifierOptions.map(opt => ({
        id: opt.id,
        name: opt.name,
        status: opt.status
      })));

      // Filter out inactive ones (accept 'active', 'available', or any non-'inactive' status)
      const activeOptions = modifierOptions.filter(
        (opt) => !opt.status || opt.status !== 'inactive',
      );

      console.log('✔️  Active options:', activeOptions.length);

      if (activeOptions.length !== allModifierOptionIds.length) {
        console.error('❌ Mismatch!');
        console.error('   Requested:', allModifierOptionIds.length);
        console.error('   Found & Active:', activeOptions.length);
        console.error('   Missing IDs:', allModifierOptionIds.filter(
          id => !activeOptions.find(opt => opt.id === id)
        ));
        throw new BadRequestException(
          'One or more modifier options not found or inactive',
        );
      }

      modifierOptionsMap = new Map(activeOptions.map((opt) => [opt.id, opt]));
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

      // Round item price to whole number first
      let itemSubtotal = Math.round(Number(menuItem.price)) * item.quantity;

      // Add modifier costs - round each modifier individually
      const modifiersData: any[] = [];
      if (item.modifiers && item.modifiers.length > 0) {
        for (const mod of item.modifiers) {
          const modOption = modifierOptionsMap.get(mod.modifier_option_id);
          if (modOption) {
            const priceAdjustment = Math.round(Number(modOption.price_adjustment));
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

    // Calculate tax (10% - can be configurable) - round to whole number for VND
    const tax = Math.round(subtotal * 0.1);
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
      where: {
        table_id: tableId,
        status: {
          notIn: ['completed', 'cancelled', 'rejected'],
        },
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
  async findByCustomerId(customerId: string, filters?: any) {
    const whereConditions: any = { customer_id: customerId };

    // Apply filters
    if (filters?.status) {
      whereConditions.status = filters.status;
    }

    if (filters?.restaurant_id) {
      whereConditions.restaurant_id = filters.restaurant_id;
    }

    if (filters?.start_date || filters?.end_date) {
      whereConditions.created_at = {};
      if (filters.start_date) {
        whereConditions.created_at.gte = filters.start_date;
      }
      if (filters.end_date) {
        whereConditions.created_at.lte = filters.end_date;
      }
    }

    const orders = await this.prisma.order.findMany({
      where: whereConditions,
      include: {
        // restaurant: {
        //   select: {
        //     id: true,
        //     name: true,
        //   },
        // },
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
        `Cannot add items to order with status "${order.status}". Order must be pending, accepted, or preparing.`
      );
    }

    // Validate menu items
    const menuItemIds = items.map(item => item.menu_item_id);
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        is_deleted: false,
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('Some menu items are invalid or unavailable');
    }

    const menuItemsMap = new Map(menuItems.map(item => [item.id, item]));

    // Validate modifiers
    const allModifierIds = items
      .flatMap(item => item.modifiers || [])
      .map(mod => mod.modifier_option_id);

    let modifierOptionsMap = new Map();
    if (allModifierIds.length > 0) {
      const modifierOptions = await this.prisma.modifierOption.findMany({
        where: {
          id: { in: allModifierIds },
          status: 'active',
        },
      });

      if (modifierOptions.length !== allModifierIds.length) {
        throw new BadRequestException('Some modifier options are invalid or unavailable');
      }

      modifierOptionsMap = new Map(modifierOptions.map(opt => [opt.id, opt]));
    }

    // Calculate new items subtotal
    let additionalSubtotal = 0;
    const newItemsData: any[] = [];

    for (const item of items) {
      const menuItem = menuItemsMap.get(item.menu_item_id);
      if (!menuItem) {
        throw new BadRequestException(`Menu item ${item.menu_item_id} not found`);
      }

      // Round item price to whole number first
      let itemSubtotal = Math.round(Number(menuItem.price)) * item.quantity;

      const modifiersData: any[] = [];
      if (item.modifiers && item.modifiers.length > 0) {
        for (const mod of item.modifiers) {
          const modOption = modifierOptionsMap.get(mod.modifier_option_id);
          if (modOption) {
            const priceAdjustment = Math.round(Number(modOption.price_adjustment));
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

    // TODO: Emit notification to waiter about additional items
    // this.notificationGateway.emitOrderItemsAdded({
    //   orderId: order.id,
    //   orderNumber: order.order_number,
    //   tableId: order.table_id,
    //   addedItemsCount: items.length,
    // });

    return this.getOrderDetails(orderId);
  }
}
