import { Controller, Get, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { QrAccessService } from './qr-access.service';

@Controller('api/qr')
export class QrAccessController {
  constructor(private qrAccessService: QrAccessService) {}

  @Get(':token')
  async verifyQrToken(@Param('token') token: string) {
    if (!token) {
      throw new BadRequestException('QR token is required');
    }

    return this.qrAccessService.verifyToken(token);
  }
}
