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
    const restaurantId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const existing = await this.prisma.menuCategory.findFirst({
      where: {
        restaurant_id: restaurantId,
        name: createDto.name,
      },
    });
    if (existing) {
      throw new ConflictException('Category name already exists');
    }
    // Tạo category mới
    return this.prisma.menuCategory.create({
      data: {
        restaurant_id: restaurantId,
        name: createDto.name,
        description: createDto.description,
        display_order: createDto.display_order ?? 0,
        status: createDto.status ?? 'active',
      },
    });
  }
  async findAll(filters?: { status?: string; sortBy?: string }) {
    const restaurantId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    // Build where clause
    const where: any = { restaurant_id: restaurantId };
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
