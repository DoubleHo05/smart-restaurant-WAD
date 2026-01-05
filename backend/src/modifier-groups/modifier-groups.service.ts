import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModifierGroupDto } from './dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from './dto/update-modifier-group.dto';
import { CreateModifierOptionDto } from './dto/create-modifier-option.dto';
import { UpdateModifierOptionDto } from './dto/update-modifier-option.dto';

@Injectable()
export class ModifierGroupsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateModifierGroupDto) {
    const restaurantId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    // ━━━ Business Rule Validation ━━━
    // Rule 1: Single-select không cần min/max
    if (dto.selection_type === 'single') {
      if (dto.min_selections || dto.max_selections) {
        throw new BadRequestException(
          'Single-select type does not use min/max selections',
        );
      }
    }
    // Rule 2: Multiple-select cần validate min <= max
    if (dto.selection_type === 'multiple') {
      const min = dto.min_selections ?? 0;
      const max = dto.max_selections ?? 0;
      if (min > max && max > 0) {
        throw new BadRequestException(
          'min_selections cannot be greater than max_selections',
        );
      }
    }
    // Rule 3: Required group phải có min >= 1
    if (dto.is_required && dto.selection_type === 'multiple') {
      const min = dto.min_selections ?? 0;
      if (min < 1) {
        throw new BadRequestException(
          'Required groups must have min_selections >= 1',
        );
      }
    }
    // ━━━ Create Group ━━━
    return this.prisma.modifierGroup.create({
      data: {
        restaurant_id: restaurantId,
        name: dto.name,
        selection_type: dto.selection_type,
        is_required: dto.is_required ?? false,
        min_selections: dto.min_selections ?? 0,
        max_selections: dto.max_selections ?? 0,
        display_order: dto.display_order ?? 0,
        status: dto.status ?? 'active',
      },
    });
  }

  async findAll(filters?: { status?: string; includeOptions?: boolean }) {
    const restaurantId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const where: any = { restaurant_id: restaurantId };
    if (filters?.status) {
      where.status = filters.status;
    }
    const groups = await this.prisma.modifierGroup.findMany({
      where,
      orderBy: { display_order: 'asc' },
      include: filters?.includeOptions
        ? {
          options: {
            where: { status: 'active' },
            orderBy: { price_adjustment: 'asc' },
          },
        }
        : undefined,
    });

    // Convert Decimal to number for JSON serialization
    return groups.map((group: any) => ({
      ...group,
      options: group.options
        ? group.options.map((option: any) => ({
          ...option,
          price_adjustment: Number(option.price_adjustment),
        }))
        : undefined,
    }));
  }
  async findOne(id: string) {
    const group = await this.prisma.modifierGroup.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { price_adjustment: 'asc' },
        },
        _count: {
          select: { menu_items: true },
        },
      },
    });
    if (!group) {
      throw new NotFoundException('Modifier group not found');
    }
    return {
      ...group,
      itemsUsingCount: group._count.menu_items,
    };
  }

  async update(id: string, dto: UpdateModifierGroupDto) {
    const group = await this.prisma.modifierGroup.findUnique({
      where: { id },
    });
    if (!group) {
      throw new NotFoundException('Modifier group not found');
    }
    // Validate business rules (giống create)
    const newType = dto.selection_type ?? group.selection_type;
    if (newType === 'single' && (dto.min_selections || dto.max_selections)) {
      throw new BadRequestException(
        'Single-select type does not use min/max selections',
      );
    }
    if (newType === 'multiple') {
      const min = dto.min_selections ?? group.min_selections;
      const max = dto.max_selections ?? group.max_selections;
      if (min > max && max > 0) {
        throw new BadRequestException('min_selections > max_selections');
      }
    }
    return this.prisma.modifierGroup.update({
      where: { id },
      data: dto,
    });
  }
  async createOption(groupId: string, dto: CreateModifierOptionDto) {
    // Validate group exists
    const group = await this.prisma.modifierGroup.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException('Modifier group not found');
    }
    // Create option
    return this.prisma.modifierOption.create({
      data: {
        group_id: groupId,
        name: dto.name,
        price_adjustment: dto.price_adjustment,
        status: dto.status ?? 'active',
      },
    });
  }

  async findOneOption(id: string) {
    const option = await this.prisma.modifierOption.findUnique({
      where: { id },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            selection_type: true,
          },
        },
      },
    });
    if (!option) {
      throw new NotFoundException('Modifier option not found');
    }
    return option;
  }
  async updateOption(id: string, dto: UpdateModifierOptionDto) {
    const option = await this.prisma.modifierOption.findUnique({
      where: { id },
    });
    if (!option) {
      throw new NotFoundException('Modifier option not found');
    }
    return this.prisma.modifierOption.update({
      where: { id },
      data: dto,
    });
  }

  async deleteOption(id: string) {
    const option = await this.prisma.modifierOption.findUnique({
      where: { id },
    });
    if (!option) {
      throw new NotFoundException('Modifier option not found');
    }
    // Soft delete - set status inactive
    return this.prisma.modifierOption.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}
