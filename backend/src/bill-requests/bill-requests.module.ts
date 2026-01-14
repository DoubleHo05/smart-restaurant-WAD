import { Module } from '@nestjs/common';
import { BillRequestsController } from './bill-requests.controller';
import { BillRequestsService } from './bill-requests.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    PaymentsModule,
    NotificationsModule,
  ],
  controllers: [BillRequestsController],
  providers: [BillRequestsService],
  exports: [BillRequestsService],
})
export class BillRequestsModule {}
