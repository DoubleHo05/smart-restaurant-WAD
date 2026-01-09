import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/admin/menu/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles('admin', 'super_admin')
  async create(@Body() createDto: CreateCategoryDto) {
    return this.categoriesService.create(createDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('restaurant_id') restaurantId?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.categoriesService.findAll(user.userId, user.roles, {
      restaurant_id: restaurantId,
      status,
      sortBy,
    });
  }
  @Put(':id')
  @Roles('admin', 'super_admin')
  async update(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateDto);
  }

  @Patch(':id/status')
  @Roles('admin', 'super_admin')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.categoriesService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles('admin', 'super_admin')
  async remove(@Param('id') id: string) {
    return this.categoriesService.softDelete(id);
  }
}
