import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicMenuService {
  constructor(private prisma: PrismaService) {}

  async getMenu(categoryId?: string, searchTerm?: string) {
    // Build where clause
    const where: any = {
      status: 'active', // Only show active items
      is_deleted: false,
    };

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Fetch menu items with categories and photos
    const items = await this.prisma.menuItem.findMany({
      where,
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
      },
      orderBy: [
        { category: { display_order: 'asc' } },
        { name: 'asc' },
      ],
    });

    // Fetch all active categories
    const categories = await this.prisma.menuCategory.findMany({
      where: { status: 'active' },
      orderBy: { display_order: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        display_order: true,
      },
    });

    // Format response
    return {
      categories,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.photos[0]?.url || null,
        category: item.category ? {
          id: item.category.id,
          name: item.category.name,
        } : null,
        isAvailable: item.status === 'active',
      })),
      totalItems: items.length,
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
                options: {
                  where: { status: 'active' },
                },
              },
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Menu item with ID ${itemId} not found`);
    }

    if (item.status !== 'active' || item.is_deleted) {
      throw new NotFoundException('This menu item is not available');
    }

    // Format response
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category ? {
        id: item.category.id,
        name: item.category.name,
      } : null,
      photos: item.photos.map(photo => ({
        id: photo.id,
        url: photo.url,
        isPrimary: photo.is_primary,
      })),
      modifierGroups: item.modifier_groups.map(mig => ({
        id: mig.modifier_group.id,
        name: mig.modifier_group.name,
        isRequired: mig.modifier_group.is_required,
        minSelection: mig.modifier_group.min_selections,
        maxSelection: mig.modifier_group.max_selections,
        options: mig.modifier_group.options.map(option => ({
          id: option.id,
          name: option.name,
          priceAdjustment: option.price_adjustment,
        })),
      })),
      isAvailable: item.status === 'active',
      preparationTime: item.prep_time_minutes,
    };
  }

  async getCategories() {
    const categories = await this.prisma.menuCategory.findMany({
      where: { status: 'active' },
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
                status: 'active',
                is_deleted: false,
              },
            },
          },
        },
      },
    });

    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      displayOrder: cat.display_order,
      itemCount: cat._count.menu_items,
    }));
  }
}
