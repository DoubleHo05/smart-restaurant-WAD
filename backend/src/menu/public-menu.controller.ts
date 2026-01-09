import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PublicMenuService } from './public-menu.service';

@Controller('api/public/menu')
export class PublicMenuController {
  constructor(private publicMenuService: PublicMenuService) {}

  @Get()
  async getMenu(
    @Query('category') categoryId?: string,
    @Query('search') searchTerm?: string,
  ) {
    return this.publicMenuService.getMenu(categoryId, searchTerm);
  }

  @Get('items/:id')
  async getItemDetails(@Param('id') itemId: string) {
    return this.publicMenuService.getItemDetails(itemId);
  }

  @Get('categories')
  async getCategories() {
    return this.publicMenuService.getCategories();
  }
}
