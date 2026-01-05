import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class QrTokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async generateToken(tableId: string) {
    // 1. Lấy thông tin bàn từ DB
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found`);
    }

    // 2. Tạo payload
    const payload = {
      tableId: tableId,
      restaurantId: 'RESTAURANT_001',
      timestamp: new Date().toISOString(),
    };

    // 3. Sign token
    const token = this.jwtService.sign(payload);

    // 4. Lưu token vào DB
    await this.prisma.table.update({
      where: { id: tableId },
      data: {
        qr_token: token,
        qr_token_created_at: new Date(),
      },
    });

    // 5. Tạo URL đầy đủ
    const frontendUrl = process.env.FRONTEND_MENU_URL;
    if (!frontendUrl) {
      throw new Error(
        'FRONTEND_MENU_URL environment variable is required for QR code generation',
      );
    }
    const qrUrl = `${frontendUrl}?table=${tableId}&token=${token}`;

    return { token, qrUrl, tableNumber: table.table_number };
  }
}
