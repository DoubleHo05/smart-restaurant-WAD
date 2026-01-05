import { Module } from '@nestjs/common';
import { ModifierGroupsController } from './modifier-groups.controller';
import { ModifierOptionController } from './modifier-option.controller';
import { ModifierGroupsService } from './modifier-groups.service';

@Module({
  controllers: [ModifierGroupsController, ModifierOptionController],
  providers: [ModifierGroupsService],
  exports: [ModifierGroupsService],
})
export class ModifierGroupsModule {}
