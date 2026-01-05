import { Controller, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { QrTokenService } from './qr-token.service';

@Controller('tables')
export class QrTokenController {
  constructor(private qrTokenService: QrTokenService) {}

  @Post(':id/qr/generate')
  @HttpCode(HttpStatus.CREATED)
  async generateQr(@Param('id') tableId: string) {
    return this.qrTokenService.generateToken(tableId);
  }

  @Post(':id/qr/regenerate')
  @HttpCode(HttpStatus.OK)
  async regenerateQr(@Param('id') tableId: string) {
    // Logic giống generate, nhưng đè token cũ
    return this.qrTokenService.generateToken(tableId);
  }
}
