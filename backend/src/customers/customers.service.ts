import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { supabase } from '../config/supabase.config';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) { }

  /**
   * Find customer by ID
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone: true,
        avatar_url: true,
        created_at: true,
        user_roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Customer not found');
    }

    // Check if user is a customer
    const hasCustomerRole = user.user_roles.some(
      (ur) => ur.role.name === 'customer',
    );

    if (!hasCustomerRole) {
      throw new BadRequestException('User is not a customer');
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
    };
  }

  /**
   * Update customer profile
   */
  async updateProfile(id: string, updateDto: UpdateProfileDto) {
    // Check if customer exists
    const customer = await this.prisma.user.findUnique({
      where: { id },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const hasCustomerRole = customer.user_roles.some(
      (ur) => ur.role.name === 'customer',
    );

    if (!hasCustomerRole) {
      throw new BadRequestException('User is not a customer');
    }

    // Check if email is being changed and is unique
    if (updateDto.email && updateDto.email !== customer.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
    }

    // Update customer
    const updatedCustomer = await this.prisma.user.update({
      where: { id },
      data: {
        email: updateDto.email,
        full_name: updateDto.full_name,
        phone: updateDto.phone,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone: true,
        avatar_url: true,
        created_at: true,
      },
    });

    return {
      message: 'Profile updated successfully',
      data: updatedCustomer,
    };
  }

  /**
   * Change customer password
   */
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    // Check if customer exists
    const customer = await this.prisma.user.findUnique({
      where: { id },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const hasCustomerRole = customer.user_roles.some(
      (ur) => ur.role.name === 'customer',
    );

    if (!hasCustomerRole) {
      throw new BadRequestException('User is not a customer');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.current_password,
      customer.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.new_password, 10);

    // Update password
    await this.prisma.user.update({
      where: { id },
      data: { password_hash: hashedPassword },
    });

    return {
      message: 'Password changed successfully',
    };
  }

  /**
   * Upload customer avatar
   */
  async uploadAvatar(id: string, file: Express.Multer.File) {
    // Verify customer exists
    const customer = await this.findById(id);

    // Delete old avatar if exists
    if (customer.avatar_url) {
      await this.deleteAvatarFile(customer.avatar_url);
    }

    // Generate unique filename
    const randomName = uuidv4();
    const ext = extname(file.originalname);
    const fileName = `${id}-${randomName}${ext}`;
    const filePath = `customer-avatars/${fileName}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new BadRequestException(`Failed to upload avatar: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update database
    const updatedCustomer = await this.prisma.user.update({
      where: { id },
      data: { avatar_url: urlData.publicUrl },
      select: {
        id: true,
        avatar_url: true,
        full_name: true,
      },
    });

    return {
      message: 'Avatar uploaded successfully',
      data: updatedCustomer,
    };
  }

  /**
   * Delete customer avatar
   */
  async deleteAvatar(id: string) {
    const customer = await this.findById(id);

    if (!customer.avatar_url) {
      throw new BadRequestException('No avatar to delete');
    }

    // Delete file from Supabase
    await this.deleteAvatarFile(customer.avatar_url);

    // Update database
    await this.prisma.user.update({
      where: { id },
      data: { avatar_url: null },
    });

    return {
      message: 'Avatar deleted successfully',
    };
  }

  /**
   * Delete avatar file from Supabase Storage
   */
  private async deleteAvatarFile(url: string) {
    try {
      // Extract file path from URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      // Get 'customer-avatars/filename.jpg'
      const filePath = pathParts.slice(-2).join('/');

      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        console.error('Failed to delete avatar file from Supabase:', error);
      }
    } catch (error) {
      console.error('Failed to delete avatar file:', error);
      // Don't throw error, just log it
    }
  }
}
