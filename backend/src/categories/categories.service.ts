import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateCategoryDto) {
    // Validate restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: createDto.restaurant_id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const existing = await this.prisma.menuCategory.findFirst({
      where: {
        restaurant_id: createDto.restaurant_id,
        name: createDto.name,
      },
    });
    if (existing) {
      throw new ConflictException('Category name already exists');
    }
    // Tạo category mới
    return this.prisma.menuCategory.create({
      data: {
        restaurant_id: createDto.restaurant_id,
        name: createDto.name,
        description: createDto.description,
        display_order: createDto.display_order ?? 0,
        status: createDto.status ?? 'active',
      },
    });
  }
  async findAll(
    userId: string,
    userRoles: string[],
    filters?: { restaurant_id?: string; status?: string; sortBy?: string },
  ) {
    const isSuperAdmin = userRoles.includes('super_admin');

    // Build where clause
    const where: any = {};

    // Filter by user's restaurants
    if (!isSuperAdmin) {
      const userRestaurants = await this.prisma.restaurant.findMany({
        where: { owner_id: userId },
        select: { id: true },
      });
      const userRestaurantIds = userRestaurants.map((r) => r.id);

      // If restaurant_id is provided, validate it belongs to user
      if (filters?.restaurant_id) {
        if (!userRestaurantIds.includes(filters.restaurant_id)) {
          throw new BadRequestException(
            'You do not have access to this restaurant',
          );
        }
        where.restaurant_id = filters.restaurant_id;
      } else {
        // Otherwise, filter by all user's restaurants
        where.restaurant_id = {
          in: userRestaurantIds,
        };
      }
    } else if (filters?.restaurant_id) {
      // Super admin can filter by specific restaurant
      where.restaurant_id = filters.restaurant_id;
    }

    if (filters?.status) {
      where.status = filters.status;
    }
    // Build orderBy
    let orderBy: any = { display_order: 'asc' }; // Default
    if (filters?.sortBy === 'name') {
      orderBy = { name: 'asc' };
    } else if (filters?.sortBy === 'created_at') {
      orderBy = { created_at: 'desc' };
    }
    // Query với include count items
    const categories = await this.prisma.menuCategory.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        display_order: true,
        status: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: { menu_items: true },
        },
      },
    });
    return categories.map((cat) => ({
      ...cat,
      itemCount: cat._count.menu_items,
    }));
  }

  async update(id: string, updateDto: UpdateCategoryDto) {
    // Kiểm tra category tồn tại
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    // Kiểm tra duplicate name (nếu đổi tên)
    if (updateDto.name && updateDto.name !== category.name) {
      const duplicate = await this.prisma.menuCategory.findFirst({
        where: {
          restaurant_id: category.restaurant_id,
          name: updateDto.name,
          id: { not: id }, // Loại trừ chính nó
        },
      });
      if (duplicate) {
        throw new ConflictException('Category name already exists');
      }
    }
    // Update
    return this.prisma.menuCategory.update({
      where: { id },
      data: updateDto,
    });
  }

  async updateStatus(id: string, status: string) {
    // Validate status value
    if (!['active', 'inactive'].includes(status)) {
      throw new BadRequestException('Status must be active or inactive');
    }
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.prisma.menuCategory.update({
      where: { id },
      data: { status },
    });
  }

  async softDelete(id: string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            menu_items: {
              where: { status: 'available', is_deleted: false },
            },
          },
        },
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    // Business rule: Không xóa nếu còn items active
    if (category._count.menu_items > 0) {
      throw new BadRequestException(
        'Cannot delete category with active items. Set status to inactive instead.',
      );
    }
    // Soft delete = set status inactive
    return this.prisma.menuCategory.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}
