import { Module } from '@nestjs/common';
import { PaymentMethodsController } from './payment-methods.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentMethodsController],
})
export class PaymentMethodsModule {}
