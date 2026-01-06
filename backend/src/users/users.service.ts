import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Get role IDs
    const roles = await this.prisma.role.findMany({
      where: { name: { in: createUserDto.roles } },
    });

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password_hash: hashedPassword,
        full_name: createUserDto.full_name,
        phone: createUserDto.phone,
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

    return this.formatUser(user);
  }

  async findAll(roleFilter?: string) {
    const users = await this.prisma.user.findMany({
      where: {
        is_deleted: false,
        ...(roleFilter && {
          user_roles: {
            some: {
              role: {
                name: roleFilter,
              },
            },
          },
        }),
      },
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
      await this.prisma.userRole.deleteMany({
        where: { user_id: id },
      });

      const roles = await this.prisma.role.findMany({
        where: { name: { in: updateUserDto.roles } },
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

  private formatUser(user: any) {
    const { password_hash, is_deleted, ...rest } = user;
    return {
      ...rest,
      roles: user.user_roles.map((ur) => ur.role.name),
    };
  }
}
