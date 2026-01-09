import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ModifierGroupsService } from './modifier-groups.service';
import { CreateModifierGroupDto } from './dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from './dto/update-modifier-group.dto';
import { CreateModifierOptionDto } from './dto/create-modifier-option.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller('api/admin/menu/modifier-groups')
export class ModifierGroupsController {
  constructor(private readonly modifierGroupsService: ModifierGroupsService) {}

  @Post()
  async create(@Body() dto: CreateModifierGroupDto) {
    return this.modifierGroupsService.create(dto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('restaurant_id') restaurantId?: string,
    @Query('status') status?: string,
    @Query('includeOptions') includeOptions?: string,
  ) {
    return this.modifierGroupsService.findAll(user.userId, user.roles, {
      restaurant_id: restaurantId,
      status,
      includeOptions: includeOptions === 'true',
    });
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.modifierGroupsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateModifierGroupDto) {
    return this.modifierGroupsService.update(id, dto);
  }

  @Post(':id/options')
  async createOption(
    @Param('id') groupId: string,
    @Body() dto: CreateModifierOptionDto,
  ) {
    return this.modifierGroupsService.createOption(groupId, dto);
  }
}
