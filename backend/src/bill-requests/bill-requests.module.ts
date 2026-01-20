import { Module, forwardRef } from '@nestjs/common';
import { BillRequestsController } from './bill-requests.controller';
import { BillRequestsService } from './bill-requests.service';
import { BillPdfService } from './bill-pdf.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PaymentsModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [BillRequestsController],
  providers: [BillRequestsService, BillPdfService],
  exports: [BillRequestsService, BillPdfService],
})
export class BillRequestsModule {}
