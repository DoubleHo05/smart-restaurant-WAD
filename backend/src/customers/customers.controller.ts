import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CustomersService } from './customers.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('api/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  /**
   * GET /api/customers/:id
   * Get customer profile
   */
  @Get(':id')
  async getProfile(@Param('id') id: string) {
    const customer = await this.customersService.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  /**
   * PATCH /api/customers/:id
   * Update customer profile
   */
  @Patch(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateDto: UpdateProfileDto,
  ) {
    return this.customersService.updateProfile(id, updateDto);
  }

  /**
   * PATCH /api/customers/:id/password
   * Change customer password
   */
  @Patch(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    changePasswordDto: ChangePasswordDto,
  ) {
    return this.customersService.changePassword(id, changePasswordDto);
  }

  /**
   * POST /api/customers/:id/avatar
   * Upload customer avatar
   */
  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.customersService.uploadAvatar(id, file);
  }

  /**
   * DELETE /api/customers/:id/avatar
   * Delete customer avatar
   */
  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id: string) {
    return this.customersService.deleteAvatar(id);
  }
}
