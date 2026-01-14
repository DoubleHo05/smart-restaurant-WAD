import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MomoService } from './momo/momo.service';
import { ZaloPayService } from './zalopay/zalopay.service';
import { VnPayService } from './vnpay/vnpay.service';
import { CashService } from './cash/cash.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly momoService: MomoService,
    private readonly zaloPayService: ZaloPayService,
    private readonly vnpayService: VnPayService,
    private readonly cashService: CashService,
  ) {}
}
