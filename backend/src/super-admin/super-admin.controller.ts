import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  /**
   * GET /api/super-admin/stats
   * Get system-wide statistics
   */
  @Get('stats')
  async getSystemStats() {
    return this.superAdminService.getSystemStats();
  }

  /**
   * GET /api/super-admin/restaurants
   * Get all restaurants with statistics
   */
  @Get('restaurants')
  async getAllRestaurants() {
    return this.superAdminService.getAllRestaurantsWithStats();
  }

  /**
   * GET /api/super-admin/restaurants/:id
   * Get restaurant details with full statistics
   */
  @Get('restaurants/:id')
  async getRestaurantDetails(@Param('id') id: string) {
    return this.superAdminService.getRestaurantDetails(id);
  }
}
