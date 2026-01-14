import { Module } from '@nestjs/common';
import { BillRequestsController } from './bill-requests.controller';
import { BillRequestsService } from './bill-requests.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BillRequestsController],
    providers: [BillRequestsService],
    exports: [BillRequestsService],
})
export class BillRequestsModule { }
