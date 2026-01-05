import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemsDto } from './dto/query-items.dto';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new menu item
   */
  async create(createDto: CreateItemDto) {
    // Validate category exists and is active
    const category = await this.prisma.menuCategory.findUnique({
      where: { id: createDto.category_id },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createDto.category_id} not found`,
      );
    }

    if (category.status !== 'active') {
      throw new BadRequestException('Cannot add items to inactive category');
    }

    // Validate modifier groups if provided
    if (createDto.modifier_group_ids && createDto.modifier_group_ids.length > 0) {
      const modifierGroups = await this.prisma.modifierGroup.findMany({
        where: {
          id: { in: createDto.modifier_group_ids },
          restaurant_id: createDto.restaurant_id,
        },
      });

      if (modifierGroups.length !== createDto.modifier_group_ids.length) {
        throw new BadRequestException('One or more modifier groups not found');
      }
    }

    // Create the menu item
    const { modifier_group_ids, ...itemData } = createDto;

    const menuItem = await this.prisma.menuItem.create({
      data: {
        ...itemData,
        is_deleted: false,
        prep_time_minutes: itemData.prep_time_minutes || 0,
        is_chef_recommended: itemData.is_chef_recommended || false,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Attach modifier groups if provided
    if (modifier_group_ids && modifier_group_ids.length > 0) {
      await this.prisma.menuItemModifierGroup.createMany({
        data: modifier_group_ids.map((groupId) => ({
          menu_item_id: menuItem.id,
          group_id: groupId,
        })),
      });
    }

    return this.getItemDetails(menuItem.id);
  }

  /**
   * Get all menu items with filtering, sorting, and pagination
   */
  async findAll(restaurantId: string, query: QueryItemsDto) {
    const {
      search,
      category_id,
      status,
      is_chef_recommended,
      sortBy = 'created_at_desc',
      page = 1,
      limit = 20,
    } = query;

    // Build where clause
    const where: any = {
      restaurant_id: restaurantId,
      is_deleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category_id) {
      where.category_id = category_id;
    }

    if (status) {
      where.status = status;
    }

    if (is_chef_recommended !== undefined) {
      where.is_chef_recommended = is_chef_recommended === 'true';
    }

    // Build order by
    let orderBy: any = { created_at: 'desc' };
    switch (sortBy) {
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'created_at_asc':
        orderBy = { created_at: 'asc' };
        break;
      case 'created_at_desc':
        orderBy = { created_at: 'desc' };
        break;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [items, totalCount] = await Promise.all([
      this.prisma.menuItem.findMany({
        where,
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
            where: { is_primary: true },
            select: {
              id: true,
              url: true,
            },
          },
          modifier_groups: {
            include: {
              modifier_group: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    // Format response
    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price.toString()),
      prepTimeMinutes: item.prep_time_minutes,
      status: item.status,
      isChefRecommended: item.is_chef_recommended,
      category: item.category,
      primaryPhoto: item.photos[0]?.url || null,
      modifierGroupsCount: item.modifier_groups.length,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return {
      data: formattedItems,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * Get a single menu item by ID with full details
   */
  async findOne(id: string) {
    const item = await this.getItemDetails(id);

    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return item;
  }

  /**
   * Update a menu item
   */
  async update(id: string, updateDto: UpdateItemDto) {
    // Check if item exists
    const existingItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem || existingItem.is_deleted) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    // Validate category if being updated
    if (updateDto.category_id) {
      const category = await this.prisma.menuCategory.findUnique({
        where: { id: updateDto.category_id },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateDto.category_id} not found`,
        );
      }

      if (category.status !== 'active') {
        throw new BadRequestException(
          'Cannot assign items to inactive category',
        );
      }
    }

    // Handle modifier groups update
    const { modifier_group_ids, ...updateData } = updateDto;

    if (modifier_group_ids !== undefined) {
      // Validate modifier groups
      if (modifier_group_ids.length > 0) {
        const modifierGroups = await this.prisma.modifierGroup.findMany({
          where: {
            id: { in: modifier_group_ids },
            restaurant_id: existingItem.restaurant_id,
          },
        });

        if (modifierGroups.length !== modifier_group_ids.length) {
          throw new BadRequestException('One or more modifier groups not found');
        }
      }

      // Delete existing associations
      await this.prisma.menuItemModifierGroup.deleteMany({
        where: { menu_item_id: id },
      });

      // Create new associations
      if (modifier_group_ids.length > 0) {
        await this.prisma.menuItemModifierGroup.createMany({
          data: modifier_group_ids.map((groupId) => ({
            menu_item_id: id,
            group_id: groupId,
          })),
        });
      }
    }

    // Update the menu item
    await this.prisma.menuItem.update({
      where: { id },
      data: updateData,
    });

    return this.getItemDetails(id);
  }

  /**
   * Soft delete a menu item
   */
  async remove(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item || item.is_deleted) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    await this.prisma.menuItem.update({
      where: { id },
      data: { is_deleted: true },
    });

    return {
      success: true,
      message: `Menu item "${item.name}" has been deleted`,
    };
  }

  /**
   * Update item status
   */
  async updateStatus(id: string, status: string) {
    const validStatuses = ['available', 'unavailable', 'sold_out'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      );
    }

    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item || item.is_deleted) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    await this.prisma.menuItem.update({
      where: { id },
      data: { status },
    });

    return {
      success: true,
      message: `Item status updated to ${status}`,
    };
  }

  /**
   * Helper: Get item with full details
   */
  private async getItemDetails(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
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
                options: true,
              },
            },
          },
        },
      },
    });

    if (!item || item.is_deleted) {
      return null;
    }

    return {
      id: item.id,
      restaurantId: item.restaurant_id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price.toString()),
      prepTimeMinutes: item.prep_time_minutes,
      status: item.status,
      isChefRecommended: item.is_chef_recommended,
      category: item.category,
      photos: item.photos.map((p) => ({
        id: p.id,
        url: p.url,
        isPrimary: p.is_primary,
      })),
      modifierGroups: item.modifier_groups
        .map((mg) => mg.modifier_group)
        .filter((g) => g !== null)
        .map((group) => ({
          id: group.id,
          name: group.name,
          selectionType: group.selection_type,
          isRequired: group.is_required,
          minSelections: group.min_selections,
          maxSelections: group.max_selections,
          status: group.status,
          options: group.options.map((opt) => ({
            id: opt.id,
            name: opt.name,
            priceAdjustment: parseFloat(opt.price_adjustment.toString()),
            status: opt.status,
          })),
        })),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }
}
