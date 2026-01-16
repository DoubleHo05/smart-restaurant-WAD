import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RestaurantStaffService } from './restaurant-staff.service';
import type {
  CreateRestaurantStaffDto,
  UpdateRestaurantStaffDto,
} from './restaurant-staff.service';

@Controller('restaurant-staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantStaffController {
  constructor(
    private readonly restaurantStaffService: RestaurantStaffService,
  ) {}

  @Post()
  @Roles('super_admin', 'admin')
  async create(@Body() createDto: CreateRestaurantStaffDto) {
    return this.restaurantStaffService.create(createDto);
  }

  @Get()
  @Roles('super_admin', 'admin')
  async findAll(@Query('restaurant_id') restaurantId?: string) {
    return this.restaurantStaffService.findAll(restaurantId);
  }

  @Get('my-restaurant')
  @Roles('waiter', 'kitchen')
  async getMyRestaurant(@CurrentUser() user: any) {
    console.log('🔍 [RestaurantStaff] Getting restaurant for user:', user.id);
    const staffRecords = await this.restaurantStaffService.findByUserId(
      user.id,
    );

    if (staffRecords.length === 0) {
      console.warn(
        '⚠️ [RestaurantStaff] No restaurant found for user:',
        user.id,
      );
      return null;
    }

    console.log('✅ [RestaurantStaff] Found restaurant:', staffRecords[0]);
    return staffRecords[0];
  }

  @Get(':id')
  @Roles('super_admin', 'admin')
  async findOne(@Param('id') id: string) {
    return this.restaurantStaffService.findOne(id);
  }

  @Get('user/:userId')
  @Roles('super_admin', 'admin', 'waiter', 'kitchen')
  async findByUserId(@Param('userId') userId: string) {
    return this.restaurantStaffService.findByUserId(userId);
  }

  @Put(':id')
  @Roles('super_admin', 'admin')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRestaurantStaffDto,
  ) {
    return this.restaurantStaffService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('super_admin', 'admin')
  async remove(@Param('id') id: string) {
    return this.restaurantStaffService.remove(id);
  }
}
