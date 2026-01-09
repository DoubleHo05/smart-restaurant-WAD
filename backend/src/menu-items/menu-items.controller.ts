import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemsDto } from './dto/query-items.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/admin/menu/items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  /**
   * POST /api/admin/menu/items
   * Create a new menu item
   */
  @Post()
  @Roles('admin', 'super_admin')
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createDto: CreateItemDto,
  ) {
    return this.menuItemsService.create(createDto);
  }

  /**
   * GET /api/admin/menu/items
   * Get all menu items with filtering, sorting, and pagination
   */
  @Get()
  async findAll(@CurrentUser() user: any, @Query() allQuery: any) {
    // Extract and remove restaurant_id from query
    const { restaurant_id, ...queryParams } = allQuery;

    // Validate the remaining query parameters
    const validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const query = await validationPipe.transform(queryParams, {
      type: 'query',
      metatype: QueryItemsDto,
    });

    return this.menuItemsService.findAll(
      user.userId,
      user.roles,
      restaurant_id,
      query,
    );
  }

  /**
   * GET /api/admin/menu/items/:id
   * Get a single menu item by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(id);
  }

  /**
   * PUT /api/admin/menu/items/:id
   * Update a menu item
   */
  @Put(':id')
  @Roles('admin', 'super_admin')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateDto: UpdateItemDto,
  ) {
    return this.menuItemsService.update(id, updateDto);
  }

  /**
   * PATCH /api/admin/menu/items/:id/status
   * Update item status
   */
  @Patch(':id/status')
  @Roles('admin', 'super_admin')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.menuItemsService.updateStatus(id, status);
  }

  /**
   * DELETE /api/admin/menu/items/:id
   * Soft delete a menu item
   */
  @Delete(':id')
  @Roles('admin', 'super_admin')
  async remove(@Param('id') id: string) {
    return this.menuItemsService.remove(id);
  }
}
