import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

interface QrTokenPayload {
  tableId: string;
  restaurantId: string;
  timestamp: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class QrAccessService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async verifyToken(token: string) {
    try {
      // 1. Verify JWT signature and decode
      const payload = this.jwtService.verify<QrTokenPayload>(token);

      // 2. Find table by ID from token
      const table = await this.prisma.table.findUnique({
        where: { id: payload.tableId },
      });

      if (!table) {
        throw new NotFoundException('Table not found');
      }

      // 3. Verify token matches the one stored in database
      if (table.qr_token !== token) {
        throw new UnauthorizedException('Invalid or expired QR token');
      }

      // 4. Check if token is still valid (optional: based on qr_token_created_at)
      // For now, we rely on JWT expiration
      
      // 5. Return table information
      return {
        success: true,
        table: {
          id: table.id,
          tableNumber: table.table_number,
          capacity: table.capacity,
          location: table.location,
          status: table.status,
        },
        message: `Welcome to Table ${table.table_number}`,
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid QR token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('QR token has expired. Please scan again.');
      }
      throw error;
    }
  }
}
