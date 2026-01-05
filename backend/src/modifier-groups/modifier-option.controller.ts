import { Controller, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { ModifierGroupsService } from './modifier-groups.service';
import { UpdateModifierOptionDto } from './dto/update-modifier-option.dto';
@Controller('api/admin/menu/modifier-options')
export class ModifierOptionController {
  constructor(private readonly service: ModifierGroupsService) {}
  /**
   * GET /api/admin/menu/modifier-options/:id
   * Get single option details (optional endpoint)
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOneOption(id);
  }
  /**
   * PUT /api/admin/menu/modifier-options/:id
   * Update option (name, price_adjustment, status)
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateModifierOptionDto) {
    return this.service.updateOption(id, dto);
  }
  /**
   * DELETE /api/admin/menu/modifier-options/:id
   * Soft delete option (set status = inactive)
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.deleteOption(id);
  }
}
