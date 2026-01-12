import { Module } from '@nestjs/common';
import { WaiterController } from './waiter.controller';
import { WaiterService } from './waiter.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TablesModule } from '../tables/tables.module';

@Module({
  imports: [PrismaModule, TablesModule],
  controllers: [WaiterController],
  providers: [WaiterService],
  exports: [WaiterService],
})
export class WaiterModule {}
