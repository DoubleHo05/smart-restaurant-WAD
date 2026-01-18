import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PublicMenuService } from './public-menu.service';

@Controller('api/public/menu')
export class PublicMenuController {
  constructor(private publicMenuService: PublicMenuService) { }

  @Get('restaurants')
  async getRestaurants() {
    return this.publicMenuService.getRestaurants();
  }

  @Get()
  async getMenu(
    @Query('category') categoryId?: string,
    @Query('search') searchTerm?: string,
    @Query('restaurant') restaurantId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.publicMenuService.getMenu(
      categoryId,
      searchTerm,
      restaurantId,
      sortBy,
      pageNum,
      limitNum,
    );
  }

  @Get('items/:id')
  async getItemDetails(@Param('id') itemId: string) {
    return this.publicMenuService.getItemDetails(itemId);
  }

  @Get('items/:id/related')
  async getRelatedItems(@Param('id') itemId: string) {
    return this.publicMenuService.getRelatedItems(itemId);
  }

  @Get('categories')
  async getCategories(@Query('restaurant') restaurantId?: string) {
    return this.publicMenuService.getCategories(restaurantId);
  }
}
