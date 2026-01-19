import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicMenuService {
  constructor(private prisma: PrismaService) { }

  async getMenu(
    categoryId?: string,
    searchTerm?: string,
    restaurantId?: string,
    sortBy?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    // Build where clause
    const where: any = {
      status: 'available', // Only show available items
      is_deleted: false,
    };

    if (restaurantId) {
      where.restaurant_id = restaurantId;
    }

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Determine orderBy based on sortBy parameter
    let orderBy: any = [
      { category: { display_order: 'asc' } },
      { name: 'asc' },
    ];

    // Calculate pagination
    const skip = (page - 1) * limit;
    const take = limit;

    // Get total count for pagination metadata
    const totalCount = await this.prisma.menuItem.count({ where });

    // Fetch menu items with categories and photos
    const items = await this.prisma.menuItem.findMany({
      where,
      skip,
      take,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            display_order: true,
          },
        },
        photos: {
          where: { is_primary: true },
          take: 1,
          select: {
            url: true,
          },
        },
        // Include order items for popularity calculation
        order_items:
          sortBy === 'popularity'
            ? {
              select: {
                id: true,
              },
            }
            : false,
      },
      orderBy:
        sortBy === 'chef'
          ? [{ is_chef_recommended: 'desc' }, { name: 'asc' }]
          : orderBy,
    });

    // Sort by popularity if requested
    let sortedItems = items;
    if (sortBy === 'popularity') {
      sortedItems = items.sort((a, b) => {
        const aCount = (a as any).order_items?.length || 0;
        const bCount = (b as any).order_items?.length || 0;
        return bCount - aCount; // Descending order (most popular first)
      });
    }

    // Fetch all active categories
    const categoriesWhere: any = { status: 'active' };
    if (restaurantId) {
      categoriesWhere.restaurant_id = restaurantId;
    }

    const categories = await this.prisma.menuCategory.findMany({
      where: categoriesWhere,
      orderBy: { display_order: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        display_order: true,
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Format response
    return {
      categories,
      items: sortedItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.photos[0]?.url || null,
        category: item.category
          ? {
            id: item.category.id,
            name: item.category.name,
          }
          : null,
        isAvailable: item.status === 'available',
        isChefRecommended: item.is_chef_recommended,
        orderCount:
          sortBy === 'popularity'
            ? (item as any).order_items?.length || 0
            : undefined,
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async getItemDetails(itemId: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: itemId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        photos: {
          orderBy: { is_primary: 'desc' },
          select: {
            id: true,
            url: true,
            is_primary: true,
          },
        },
        modifier_groups: {
          include: {
            modifier_group: {
              include: {
                options: true, // Get all options to debug
              },
            },
          },
        },
      },
    });

    console.log('📦 [Menu] Item fetched:', {
      id: itemId,
      name: item?.name,
      modifier_groups_count: item?.modifier_groups?.length,
      modifier_groups: item?.modifier_groups?.map((mg) => ({
        id: mg.modifier_group.id,
        name: mg.modifier_group.name,
        options_count: mg.modifier_group.options.length,
        options: mg.modifier_group.options.map((opt) => ({
          id: opt.id,
          name: opt.name,
          status: opt.status,
        })),
      })),
    });

    if (!item) {
      throw new NotFoundException(`Menu item with ID ${itemId} not found`);
    }

    if (item.status !== 'available' || item.is_deleted) {
      throw new NotFoundException('This menu item is not available');
    }

    // Format response
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
        ? {
          id: item.category.id,
          name: item.category.name,
        }
        : null,
      photos: item.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        isPrimary: photo.is_primary,
      })),
      modifierGroups: item.modifier_groups.map((mig) => ({
        id: mig.modifier_group.id,
        name: mig.modifier_group.name,
        isRequired: mig.modifier_group.is_required,
        minSelection: mig.modifier_group.min_selections,
        maxSelection: mig.modifier_group.max_selections,
        options: mig.modifier_group.options.map((option) => ({
          id: option.id,
          name: option.name,
          priceAdjustment: option.price_adjustment,
        })),
      })),
      isAvailable: item.status === 'available',
      preparationTime: item.prep_time_minutes,
    };
  }

  async getCategories(restaurantId?: string) {
    const where: any = { status: 'active' };
    if (restaurantId) {
      where.restaurant_id = restaurantId;
    }

    const categories = await this.prisma.menuCategory.findMany({
      where,
      orderBy: { display_order: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        display_order: true,
        _count: {
          select: {
            menu_items: {
              where: {
                status: 'available',
                is_deleted: false,
              },
            },
          },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      displayOrder: cat.display_order,
      itemCount: cat._count.menu_items,
    }));
  }

  async getRestaurants() {
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        status: 'active',
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        status: true,
      },
      orderBy: { name: 'asc' },
    });

    return restaurants;
  }

  async getRelatedItems(itemId: string) {
    // First, get the current item to know its category
    const currentItem = await this.prisma.menuItem.findUnique({
      where: { id: itemId },
      select: {
        category_id: true,
        restaurant_id: true,
      },
    });

    if (!currentItem) {
      throw new NotFoundException(`Menu item with ID ${itemId} not found`);
    }

    // Get 6 random items from the same category, excluding current item
    const relatedItems = await this.prisma.menuItem.findMany({
      where: {
        category_id: currentItem.category_id,
        restaurant_id: currentItem.restaurant_id,
        status: 'available',
        is_deleted: false,
        id: { not: itemId }, // Exclude current item
      },
      include: {
        photos: {
          where: { is_primary: true },
          take: 1,
          select: {
            url: true,
          },
        },
      },
      take: 6,
      orderBy: {
        // Random-ish ordering by created_at with some variety
        created_at: 'desc',
      },
    });

    // Format response
    return relatedItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.photos[0]?.url || null,
      isAvailable: item.status === 'available',
      isChefRecommended: item.is_chef_recommended,
    }));
  }
}
