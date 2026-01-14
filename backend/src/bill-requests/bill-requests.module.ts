import { Module } from '@nestjs/common';
import { BillRequestsController } from './bill-requests.controller';
import { BillRequestsService } from './bill-requests.service';

@Module({
  controllers: [BillRequestsController],
  providers: [BillRequestsService],
  exports: [BillRequestsService],
})
export class BillRequestsModule {}
