import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new restaurant
   * Owner will be the current user
   */
  async create(userId: string, createDto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({
      data: {
        ...createDto,
        owner_id: userId,
        status: 'active',
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            full_name: true,
          },
        },
      },
    });
  }

  /**
   * Get all restaurants for current user
   * - Super admin sees all restaurants
   * - Admin sees only their owned restaurants
   */
  async findAll(userId: string, userRoles: string[]) {
    const isSuperAdmin = userRoles.includes('super_admin');

    const where: any = {};
    if (!isSuperAdmin) {
      where.owner_id = userId;
    }

    return this.prisma.restaurant.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            full_name: true,
          },
        },
        _count: {
          select: {
            tables: true,
            menu_categories: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Get single restaurant by ID
   */
  async findOne(id: string, userId: string, userRoles: string[]) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            full_name: true,
          },
        },
        _count: {
          select: {
            tables: true,
            menu_categories: true,
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Check ownership unless super_admin
    if (!userRoles.includes('super_admin') && restaurant.owner_id !== userId) {
      throw new ForbiddenException('You do not have access to this restaurant');
    }

    return restaurant;
  }

  /**
   * Update restaurant
   */
  async update(
    id: string,
    userId: string,
    userRoles: string[],
    updateDto: UpdateRestaurantDto,
  ) {
    // Check ownership first
    await this.findOne(id, userId, userRoles);

    return this.prisma.restaurant.update({
      where: { id },
      data: updateDto,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            full_name: true,
          },
        },
      },
    });
  }

  /**
   * Delete restaurant (soft delete by setting status to inactive)
   */
  async remove(id: string, userId: string, userRoles: string[]) {
    // Check ownership first
    await this.findOne(id, userId, userRoles);

    return this.prisma.restaurant.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  /**
   * Check if user has access to a restaurant
   */
  async validateAccess(
    restaurantId: string,
    userId: string,
    userRoles: string[],
  ): Promise<boolean> {
    const isSuperAdmin = userRoles.includes('super_admin');
    if (isSuperAdmin) return true;

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { owner_id: true },
    });

    return restaurant?.owner_id === userId;
  }
}
