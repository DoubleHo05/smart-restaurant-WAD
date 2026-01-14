import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  /**
   * GET /reports/daily-revenue?restaurant_id=xxx&start_date=2026-01-01&end_date=2026-01-31
   */
  @Get('daily-revenue')
  async getDailyRevenue(
    @Query('restaurant_id') restaurantId: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    if (!restaurantId || !startDate || !endDate) {
      throw new BadRequestException('Missing required parameters');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.reportsService.getDailyRevenue(restaurantId, start, end);
  }

  /**
   * GET /reports/popular-items?restaurant_id=xxx&limit=10&days=30
   */
  @Get('popular-items')
  async getPopularItems(
    @Query('restaurant_id') restaurantId: string,
    @Query('limit') limit?: string,
    @Query('days') days?: string,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.reportsService.getPopularItems(
      restaurantId,
      limit ? parseInt(limit) : 10,
      days ? parseInt(days) : 30,
    );
  }

  /**
   * GET /reports/orders-by-status?restaurant_id=xxx
   */
  @Get('orders-by-status')
  async getOrdersByStatus(
    @Query('restaurant_id') restaurantId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.reportsService.getOrdersByStatus(restaurantId, start, end);
  }

  /**
   * GET /reports/average-prep-time?restaurant_id=xxx&days=7
   */
  @Get('average-prep-time')
  async getAveragePrepTime(
    @Query('restaurant_id') restaurantId: string,
    @Query('days') days?: string,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.reportsService.getAveragePrepTime(
      restaurantId,
      days ? parseInt(days) : 7,
    );
  }

  /**
   * GET /reports/dashboard-summary?restaurant_id=xxx
   */
  @Get('dashboard-summary')
  async getDashboardSummary(@Query('restaurant_id') restaurantId: string) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.reportsService.getDashboardSummary(restaurantId);
  }

  /**
   * GET /reports/revenue-by-category?restaurant_id=xxx&start_date=2026-01-01&end_date=2026-01-31
   * Task 3.4 - Advanced Reports
   */
  @Get('revenue-by-category')
  async getRevenueByCategory(
    @Query('restaurant_id') restaurantId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.reportsService.getRevenueByCategory(
      restaurantId,
      startDate,
      endDate,
    );
  }

  /**
   * GET /reports/waiter-performance?restaurant_id=xxx&start_date=2026-01-01&end_date=2026-01-31
   * Task 3.4 - Advanced Reports
   */
  @Get('waiter-performance')
  async getWaiterPerformance(
    @Query('restaurant_id') restaurantId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.reportsService.getWaiterPerformance(
      restaurantId,
      startDate,
      endDate,
    );
  }

  /**
   * GET /reports/kitchen-efficiency?restaurant_id=xxx&start_date=2026-01-01&end_date=2026-01-31
   * Task 3.4 - Advanced Reports
   */
  @Get('kitchen-efficiency')
  async getKitchenEfficiency(
    @Query('restaurant_id') restaurantId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.reportsService.getKitchenEfficiency(
      restaurantId,
      startDate,
      endDate,
    );
  }

  /**
   * GET /reports/customer-retention?restaurant_id=xxx&start_date=2026-01-01&end_date=2026-01-31
   * Task 3.4 - Advanced Reports
   */
  @Get('customer-retention')
  async getCustomerRetention(
    @Query('restaurant_id') restaurantId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.reportsService.getCustomerRetention(
      restaurantId,
      startDate,
      endDate,
    );
  }

  /**
   * GET /reports/peak-hours?restaurant_id=xxx&start_date=2026-01-01&end_date=2026-01-31
   * Task 3.4 - Advanced Reports
   */
  @Get('peak-hours')
  async getPeakHours(
    @Query('restaurant_id') restaurantId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    if (!restaurantId) {
      throw new BadRequestException('restaurant_id is required');
    }

    return this.reportsService.getPeakHours(restaurantId, startDate, endDate);
  }
}
