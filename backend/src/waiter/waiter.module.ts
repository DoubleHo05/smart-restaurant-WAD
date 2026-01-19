import { Module } from '@nestjs/common';
import { WaiterController } from './waiter.controller';
import { WaiterService } from './waiter.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TablesModule } from '../tables/tables.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, TablesModule, NotificationsModule],
  controllers: [WaiterController],
  providers: [WaiterService],
  exports: [WaiterService],
})
export class WaiterModule {}
