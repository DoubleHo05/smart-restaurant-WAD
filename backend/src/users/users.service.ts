import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { RestaurantStaffService } from '../restaurant-staff/restaurant-staff.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private restaurantStaffService: RestaurantStaffService,
  ) { }

  async create(createUserDto: CreateUserDto, restaurantId?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Filter out super_admin role - only allow other roles
    const filteredRoles = createUserDto.roles.filter(
      (role) => role !== 'super_admin',
    );

    console.log(
      '🔍 [UsersService.create] Original roles:',
      createUserDto.roles,
    );
    console.log('🔍 [UsersService.create] Filtered roles:', filteredRoles);

    // Get role IDs
    const roles = await this.prisma.role.findMany({
      where: { name: { in: filteredRoles } },
    });

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password_hash: hashedPassword,
        full_name: createUserDto.full_name,
        phone: createUserDto.phone,
        email_verified: true, // Admin-created users are pre-verified
        status: 'active', // Set active status for immediate use
        user_roles: {
          create: roles.map((role) => ({ role_id: role.id })),
        },
      },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Auto-create restaurant_staff record if user is waiter or kitchen and restaurantId is provided
    const staffRoles = filteredRoles.filter(
      (role) => role === 'waiter' || role === 'kitchen',
    );

    console.log(
      '🔍 [UsersService.create] Checking restaurant_staff creation...',
    );
    console.log('  - staffRoles:', staffRoles);
    console.log('  - restaurantId:', restaurantId);

    if (staffRoles.length > 0 && restaurantId) {
      console.log('  ✅ Creating restaurant_staff records...');
      for (const role of staffRoles) {
        const staffRecord = await this.restaurantStaffService.create({
          restaurant_id: restaurantId,
          user_id: user.id,
          role: role as 'waiter' | 'kitchen',
          status: 'active',
        });
        console.log('  ✅ Created staff record:', staffRecord);
      }
      console.log(
        `✅ [UsersService.create] Created restaurant_staff records for ${staffRoles.join(', ')}`,
      );
    } else {
      console.warn('⚠️ [UsersService.create] NOT creating restaurant_staff:');
      console.warn('  - staffRoles.length:', staffRoles.length);
      console.warn('  - restaurantId:', restaurantId);
    }

    return this.formatUser(user);
  }

  async findAll(roleFilter?: string, isSuperAdmin: boolean = false) {
    // Build where clause based on user type
    const whereClause: any = {
      is_deleted: false,
    };

    // If roleFilter provided, filter by role
    if (roleFilter) {
      whereClause.user_roles = {
        some: {
          role: {
            name: roleFilter,
          },
        },
      };
    } else if (!isSuperAdmin) {
      // If admin (not superadmin) and no specific filter, only show waiter and kitchen
      whereClause.user_roles = {
        some: {
          role: {
            name: {
              in: ['waiter', 'kitchen'],
            },
          },
        },
      };
    }
    // SuperAdmin without filter sees all users (no additional where clause)

    console.log('🔍 [UsersService.findAll]', {
      isSuperAdmin,
      roleFilter,
      whereClause: JSON.stringify(whereClause),
    });

    const users = await this.prisma.user.findMany({
      where: whereClause,
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return users.map((user) => this.formatUser(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || user.is_deleted) {
      throw new NotFoundException('User not found');
    }

    return this.formatUser(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const updateData: any = {
      full_name: updateUserDto.full_name,
      phone: updateUserDto.phone,
      status: updateUserDto.status,
    };

    // Update roles if provided
    if (updateUserDto.roles) {
      // Validation: User must have at least one role
      if (updateUserDto.roles.length === 0) {
        throw new ConflictException('User must have at least one role');
      }

      // Filter out super_admin role - only allow other roles
      const filteredRoles = updateUserDto.roles.filter(
        (role) => role !== 'super_admin',
      );

      // After filtering, ensure user still has at least one role
      if (filteredRoles.length === 0) {
        throw new ConflictException(
          'User must have at least one valid role (super_admin not allowed)',
        );
      }

      console.log(
        '🔍 [UsersService.update] Original roles:',
        updateUserDto.roles,
      );
      console.log('🔍 [UsersService.update] Filtered roles:', filteredRoles);

      await this.prisma.userRole.deleteMany({
        where: { user_id: id },
      });

      const roles = await this.prisma.role.findMany({
        where: { name: { in: filteredRoles } },
      });

      updateData.user_roles = {
        create: roles.map((role) => ({ role_id: role.id })),
      };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return this.formatUser(updatedUser);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.update({
      where: { id },
      data: { is_deleted: true, status: 'inactive' },
    });

    return { message: 'User deleted successfully' };
  }

  async findAdminRestaurant(userId: string) {
    // Find restaurant owned by admin user
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        owner_id: userId,
        is_deleted: false,
      },
    });
    return restaurant;
  }

  private formatUser(user: any) {
    const { password_hash, is_deleted, ...rest } = user;
    return {
      ...rest,
      roles: user.user_roles.map((ur) => ur.role.name),
    };
  }
}
