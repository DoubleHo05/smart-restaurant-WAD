import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/admin/restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles('super_admin', 'admin', 'waiter')
  async create(
    @CurrentUser() user: any,
    @Body() createDto: CreateRestaurantDto,
  ) {
    // SuperAdmin can specify owner_id in DTO
    return this.restaurantsService.create(createDto);
  }

  @Get()
  @Roles('super_admin', 'admin', 'waiter')
  async findAll(@CurrentUser() user: any) {
    console.log(
      '🔑 [RestaurantsController.findAll] user:',
      JSON.stringify(user, null, 2),
    );
    return this.restaurantsService.findAll(user.userId, user.roles);
  }

  @Get(':id')
  @Roles('super_admin', 'admin', 'waiter')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.restaurantsService.findOne(id, user.userId, user.roles);
  }

  @Put(':id')
  @Roles('super_admin', 'admin', 'waiter')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(
      id,
      user.userId,
      user.roles,
      updateDto,
    );
  }

  @Delete(':id')
  @Roles('super_admin', 'admin', 'waiter')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.restaurantsService.remove(id, user.userId, user.roles);
  }
}
