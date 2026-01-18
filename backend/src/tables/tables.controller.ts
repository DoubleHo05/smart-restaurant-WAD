import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get()
  @Roles('admin', 'waiter', 'kitchen', 'super_admin')
  findAll(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('location') location?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.tablesService.findAll(user.userId, user.roles, {
      status,
      location,
      sortBy,
      sortOrder,
    });
  }

  @Get('locations')
  @Roles('admin', 'waiter', 'kitchen', 'super_admin')
  getLocations() {
    return this.tablesService.getLocations();
  }

  /**
   * GET /tables/status/overview?restaurant_id={uuid}
   * Get table status overview for a restaurant
   * Returns all tables with their occupancy status and counts
   */
  @Get('status/overview')
  @Roles('admin', 'waiter', 'super_admin')
  getTableStatusOverview(@Query('restaurant_id') restaurantId: string) {
    if (!restaurantId) {
      return {
        success: false,
        error: 'restaurant_id is required',
      };
    }
    return this.tablesService.getTableStatusOverview(restaurantId);
  }

  @Get(':id')
  @Roles('admin', 'waiter', 'kitchen', 'super_admin')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'super_admin')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Patch(':id/status')
  @Roles('admin', 'super_admin')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.tablesService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }

  /**
   * PATCH /api/tables/:id/occupancy-status?restaurant_id={uuid}
   * Manually update table occupancy status (available, occupied, reserved)
   */
  @Patch(':id/occupancy-status')
  @Roles('admin', 'waiter', 'super_admin')
  updateTableOccupancyStatus(
    @Param('id') tableId: string,
    @Query('restaurant_id') restaurantId: string,
    @Body() updateTableStatusDto: UpdateTableStatusDto,
  ) {
    if (!restaurantId) {
      return {
        success: false,
        error: 'restaurant_id is required',
      };
    }
    return this.tablesService.updateTableOccupancyStatus(
      tableId,
      restaurantId,
      updateTableStatusDto.status as 'available' | 'occupied' | 'reserved',
    );
  }
}
