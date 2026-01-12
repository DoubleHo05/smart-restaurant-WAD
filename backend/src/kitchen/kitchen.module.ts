import { Module } from '@nestjs/common';
import { KitchenController } from './kitchen.controller';
import { KitchenService } from './kitchen.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TablesModule } from '../tables/tables.module';

@Module({
  imports: [PrismaModule, TablesModule],
  controllers: [KitchenController],
  providers: [KitchenService],
  exports: [KitchenService],
})
export class KitchenModule {}
