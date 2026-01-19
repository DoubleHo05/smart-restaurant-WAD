import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('super_admin', 'admin')
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: any) {
    // Validate role permissions
    const isSuperAdmin = user.roles.includes('super_admin');
    const isAdmin = user.roles.includes('admin');

    // Super admin can create admin accounts
    // Admin can only create waiter and kitchen accounts
    if (isAdmin && !isSuperAdmin) {
      const invalidRoles = createUserDto.roles.filter(
        (role) =>
          role !== 'waiter' && role !== 'kitchen' && role !== 'customer',
      );
      if (invalidRoles.length > 0) {
        throw new ForbiddenException(
          'Admin can only create waiter, kitchen, and customer accounts',
        );
      }
    }

    // Get restaurant_id: Admin needs to pass it in the body or get from their owned restaurant
    let restaurantId: string | undefined;

    if (isAdmin && !isSuperAdmin) {
      // For admin creating staff, get restaurantId from body or find their restaurant
      console.log(
        '🔍 [UsersController.create] Admin creating staff, checking restaurant_id...',
      );
      console.log(
        '  - createUserDto.restaurant_id:',
        createUserDto.restaurant_id,
      );

      if (createUserDto.restaurant_id) {
        restaurantId = createUserDto.restaurant_id;
        console.log('  ✅ Using restaurant_id from DTO:', restaurantId);
      } else {
        // Find restaurant owned by this admin
        console.log('  - No restaurant_id in DTO, finding admin restaurant...');
        const restaurant = await this.usersService.findAdminRestaurant(user.id);
        restaurantId = restaurant?.id;
        console.log(
          '  - Found admin restaurant:',
          restaurant?.name,
          restaurantId,
        );
      }

      console.log('  ✅ Final restaurantId to pass to service:', restaurantId);
    }

    return this.usersService.create(createUserDto, restaurantId);
  }

  @Get()
  @Roles('super_admin', 'admin')
  async findAll(@CurrentUser() user: any, @Query('role') role?: string) {
    const isSuperAdmin = user.roles.includes('super_admin');
    const isAdmin = user.roles.includes('admin') && !isSuperAdmin;

    let restaurantId: string | undefined;

    // If admin (not super_admin), get their restaurant to filter staff
    if (isAdmin) {
      const restaurant = await this.usersService.findAdminRestaurant(user.id);
      restaurantId = restaurant?.id;
    }

    return this.usersService.findAll(role, isSuperAdmin, restaurantId);
  }

  @Get(':id')
  @Roles('super_admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('super_admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
