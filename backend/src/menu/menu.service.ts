import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) { }

  async getGuestMenu(
    restaurantId: string,
    filters?: {
      categoryId?: string;
      search?: string;
      chefRecommended?: boolean;
      sortBy?: string;
      page?: number;
      limit?: number;
    },
  ) {
    // Get active categories
    const categories = await this.prisma.menuCategory.findMany({
      where: {
        restaurant_id: restaurantId,
        status: 'active',
      },
      orderBy: {
        display_order: 'asc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        display_order: true,
      },
    });

    // Build items filter
    const itemsWhere: any = {
      restaurant_id: restaurantId,
      is_deleted: false,
      status: 'available',
      category: {
        status: 'active',
      },
    };

    if (filters?.categoryId) {
      itemsWhere.category_id = filters.categoryId;
    }

    if (filters?.search) {
      itemsWhere.name = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    if (filters?.chefRecommended !== undefined) {
      itemsWhere.is_chef_recommended = filters.chefRecommended;
    }

    // Calculate pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    // Build order by
    let orderBy: any = { created_at: 'desc' };
    if (filters?.sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (filters?.sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (filters?.sortBy === 'name') {
      orderBy = { name: 'asc' };
    }

    // Get items with all related data
    const [items, totalItems] = await Promise.all([
      this.prisma.menuItem.findMany({
        where: itemsWhere,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          photos: {
            orderBy: {
              is_primary: 'desc',
            },
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
                  options: {
                    orderBy: {
                      price_adjustment: 'asc',
                    },
                    select: {
                      id: true,
                      name: true,
                      price_adjustment: true,
                      status: true,
                    },
                  },
                },
                select: {
                  id: true,
                  name: true,
                  selection_type: true,
                  is_required: true,
                  min_selections: true,
                  max_selections: true,
                  status: true,
                  options: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.menuItem.count({ where: itemsWhere }),
    ]);

    // Format response
    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price.toString()),
      prepTimeMinutes: item.prep_time_minutes,
      isChefRecommended: item.is_chef_recommended,
      category: item.category,
      primaryPhoto: item.photos.find((p) => p.is_primary)?.url || null,
      photos: item.photos.map((p) => ({
        id: p.id,
        url: p.url,
        isPrimary: p.is_primary,
      })),
      modifierGroups: item.modifier_groups
        .map((mg) => mg.modifier_group)
        .filter((g) => g !== null && g.status === 'active')
        .map((group) => ({
          id: group.id,
          name: group.name,
          selectionType: group.selection_type,
          isRequired: group.is_required,
          minSelections: group.min_selections,
          maxSelections: group.max_selections,
          options: group.options
            .filter((opt) => opt.status === 'active')
            .map((opt) => ({
              id: opt.id,
              name: opt.name,
              priceAdjustment: parseFloat(opt.price_adjustment.toString()),
            })),
        })),
    }));

    return {
      categories,
      items: formattedItems,
      pagination: {
        page,
        limit,
        total: totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }
}
