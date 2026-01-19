import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Payment Methods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active payment methods (Public)' })
  @ApiResponse({ status: 200, description: 'List of payment methods retrieved' })
  async getPaymentMethods() {
    return this.prisma.payment_methods.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        logo_url: true,
        display_order: true,
      },
      orderBy: {
        display_order: 'asc',
      },
    });
  }
}
