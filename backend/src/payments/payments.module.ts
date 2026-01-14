import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MomoService } from './momo/momo.service';
import { ZaloPayService } from './zalopay/zalopay.service';
import { VnPayService } from './vnpay/vnpay.service';
import { CashService } from './cash/cash.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    MomoService,
    ZaloPayService,
    VnPayService,
    CashService,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
