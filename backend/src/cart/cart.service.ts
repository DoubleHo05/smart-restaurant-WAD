import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  /**
   * Add item to cart
   */
  async addToCart(
    customerId: string | null,
    sessionId: string,
    addToCartDto: AddToCartDto,
  ) {
    // 1. Validate menu item exists and is available
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: addToCartDto.menu_item_id },
    });

    console.log('Menu item found:', {
      id: menuItem?.id,
      name: menuItem?.name,
      status: menuItem?.status,
      statusType: typeof menuItem?.status,
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    // Accept both 'active' and 'available' as valid statuses
    const validStatuses = ['active', 'available'];
    if (!validStatuses.includes(menuItem.status?.toLowerCase())) {
      throw new BadRequestException(
        `Menu item is not available (current status: ${menuItem.status})`,
      );
    }

    // 2. Validate modifiers if provided
    if (addToCartDto.modifiers && addToCartDto.modifiers.length > 0) {
      const modifierOptionIds = addToCartDto.modifiers.map(
        (m) => m.modifier_option_id,
      );
      const modifierOptions = await this.prisma.modifierOption.findMany({
        where: {
          id: { in: modifierOptionIds },
          status: 'active',
        },
      });

      if (modifierOptions.length !== modifierOptionIds.length) {
        throw new BadRequestException('One or more modifiers are invalid');
      }
    }

    // 3. Find or create cart for this session/customer
    // For guest users (no customer_id), we MUST query by session_id only
    // to prevent cross-table cart pollution
    let cart;

    if (customerId) {
      // Logged-in user: find by customer_id
      cart = await this.prisma.cart.findFirst({
        where: { customer_id: customerId },
      });
    } else {
      // Guest user: find by session_id ONLY
      cart = await this.prisma.cart.findFirst({
        where: { session_id: sessionId },
      });
    }

    console.log('🔍 [Cart Service] Finding cart:', {
      customerId,
      sessionId,
      foundCartId: cart?.id,
      foundCartSessionId: cart?.session_id,
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          customer_id: customerId,
          session_id: sessionId,
        },
      });
      console.log('🆕 [Cart Service] Created new cart:', cart.id);
    }

    // 4. Check if item already exists in cart
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        menu_item_id: addToCartDto.menu_item_id,
      },
      include: {
        modifiers: true,
      },
    });

    // If item exists, update quantity
    if (existingCartItem) {
      const updatedCartItem = await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + addToCartDto.quantity,
          special_requests: addToCartDto.special_requests,
        },
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
      });

      return {
        message: 'Item quantity updated in cart',
        cart_item: updatedCartItem,
      };
    }

    // 5. Create new cart item
    const cartItem = await this.prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        menu_item_id: addToCartDto.menu_item_id,
        quantity: addToCartDto.quantity,
        special_requests: addToCartDto.special_requests,
        modifiers: addToCartDto.modifiers
          ? {
            createMany: {
              data: addToCartDto.modifiers.map((mod) => ({
                modifier_option_id: mod.modifier_option_id,
              })),
            },
          }
          : undefined,
      },
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
    });

    return {
      message: 'Item added to cart',
      cart_item: cartItem,
    };
  }

  /**
   * Get cart with all items and calculate totals
   */
  async getCart(customerId: string | null, sessionId: string) {
    let cart;

    if (customerId) {
      // Logged-in user: find by customer_id
      cart = await this.prisma.cart.findFirst({
        where: { customer_id: customerId },
        include: {
          cart_items: {
            include: {
              menu_item: {
                select: {
                  id: true,
                  name: true,
                  description: true,
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
      });
    } else {
      // Guest user: find by session_id ONLY
      cart = await this.prisma.cart.findFirst({
        where: { session_id: sessionId },
        include: {
          cart_items: {
            include: {
              menu_item: {
                select: {
                  id: true,
                  name: true,
                  description: true,
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
      });
    }

    console.log('🔍 [Cart Service] getCart:', {
      customerId,
      sessionId,
      foundCartId: cart?.id,
      itemCount: cart?.cart_items?.length || 0,
    });

    if (!cart || cart.cart_items.length === 0) {
      return {
        cart_id: cart?.id || null,
        items: [],
        item_count: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
      };
    }

    // Calculate totals
    let subtotal = 0;
    const items = cart.cart_items.map((item) => {
      // Round item price to whole number first
      let itemPrice = Math.round(Number(item.menu_item.price));

      // Add modifier prices - round each modifier individually
      let modifiersTotal = 0;
      if (item.modifiers && item.modifiers.length > 0) {
        modifiersTotal = item.modifiers.reduce(
          (sum, mod) => sum + Math.round(Number(mod.modifier_option.price_adjustment)),
          0,
        );
      }

      const itemTotal = (itemPrice + modifiersTotal) * item.quantity;
      subtotal += itemTotal;

      return {
        id: item.id,
        menu_item_id: item.menu_item_id,
        name: item.menu_item.name,
        description: item.menu_item.description,
        price: item.menu_item.price,
        quantity: item.quantity,
        special_requests: item.special_requests,
        modifiers: item.modifiers.map((mod) => ({
          id: mod.id,
          modifier_option_id: mod.modifier_option_id,
          name: mod.modifier_option.name,
          price_adjustment: mod.modifier_option.price_adjustment,
        })),
        item_total: itemTotal,
      };
    });

    const tax = Math.round(subtotal * 0.1); // 10% tax, rounded to whole number
    const total = subtotal + tax; // Total is already whole number

    return {
      cart_id: cart.id,
      items,
      item_count: cart.cart_items.length,
      subtotal,
      tax,
      total,
    };
  }

  /**
   * Update cart item
   */
  async updateCartItem(cartItemId: string, updateDto: UpdateCartItemDto) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // If modifiers are being updated, delete old ones and create new ones
    if (updateDto.modifiers) {
      await this.prisma.cartItemModifier.deleteMany({
        where: { cart_item_id: cartItemId },
      });

      if (updateDto.modifiers.length > 0) {
        await this.prisma.cartItemModifier.createMany({
          data: updateDto.modifiers.map((mod) => ({
            cart_item_id: cartItemId,
            modifier_option_id: mod.modifier_option_id,
          })),
        });
      }
    }

    // Update quantity and special requests
    const updatedItem = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: updateDto.quantity,
        special_requests: updateDto.special_requests,
      },
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
    });

    return {
      message: 'Cart item updated',
      cart_item: updatedItem,
    };
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return {
      message: 'Item removed from cart',
    };
  }

  /**
   * Clear entire cart
   */
  async clearCart(customerId: string | null, sessionId: string) {
    let cart;

    if (customerId) {
      // Logged-in user: find by customer_id
      cart = await this.prisma.cart.findFirst({
        where: { customer_id: customerId },
      });
    } else {
      // Guest user: find by session_id ONLY
      cart = await this.prisma.cart.findFirst({
        where: { session_id: sessionId },
      });
    }

    if (!cart) {
      return {
        message: 'Cart is already empty',
      };
    }

    // Delete all cart items (cascade will delete modifiers)
    await this.prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return {
      message: 'Cart cleared',
    };
  }
}
