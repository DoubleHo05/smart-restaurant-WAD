import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateRestaurantStaffDto {
  restaurant_id: string;
  user_id: string;
  role: 'waiter' | 'kitchen';
  status?: string;
}

export interface UpdateRestaurantStaffDto {
  role?: 'waiter' | 'kitchen';
  status?: string;
}

@Injectable()
export class RestaurantStaffService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRestaurantStaffDto) {
    return this.prisma.restaurantStaff.create({
      data: {
        restaurant_id: data.restaurant_id,
        user_id: data.user_id,
        role: data.role,
        status: data.status || 'active',
      },
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            phone: true,
          },
        },
      },
    });
  }

  async findAll(restaurantId?: string) {
    return this.prisma.restaurantStaff.findMany({
      where: restaurantId ? { restaurant_id: restaurantId } : {},
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            phone: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.restaurantStaff.findUnique({
      where: { id },
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            phone: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.restaurantStaff.findMany({
      where: { user_id: userId },
      include: {
        restaurant: true,
      },
    });
  }

  async findByRestaurantAndUser(restaurantId: string, userId: string) {
    return this.prisma.restaurantStaff.findFirst({
      where: {
        restaurant_id: restaurantId,
        user_id: userId,
      },
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            phone: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateRestaurantStaffDto) {
    return this.prisma.restaurantStaff.update({
      where: { id },
      data,
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            phone: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.restaurantStaff.delete({
      where: { id },
    });
  }

  async removeByUserId(userId: string) {
    return this.prisma.restaurantStaff.deleteMany({
      where: { user_id: userId },
    });
  }
}
