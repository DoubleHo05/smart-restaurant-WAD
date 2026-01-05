import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MenuService } from './menu.service';
@Controller('api') // ← Base route: /api
export class MenuController {
  constructor(
    private jwtService: JwtService, // ← Inject JwtService
    private prisma: PrismaService, // ← Inject PrismaService
    private menuService: MenuService, // ← Inject MenuService
  ) {}
  // ━━━ API: Verify QR token và hiển thị menu ━━━
  @Get('menu') // ← Full route: GET /api/menu
  async verifyQrAndShowMenu(
    @Query('table') tableId: string, // ← Query param: ?table=...
    @Query('token') token: string, // ← Query param: &token=...
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('chefRecommended') chefRecommended?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // ━━━ BƯỚC 1: Validate input ━━━
    if (!tableId || !token) {
      throw new BadRequestException('Missing table or token parameter');
    }
    // ━━━ BƯỚC 2: Lấy thông tin bàn từ DB ━━━
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new BadRequestException('Table not found');
    }

    // ━━━ BƯỚC 3: So sánh token với DB ━━━
    // Ý nghĩa: Kiểm tra token có phải là token MỚI NHẤT không
    if (table.qr_token !== token) {
      throw new BadRequestException('Invalid or expired QR code');
    }

    // ━━━ BƯỚC 4: Verify chữ ký (signature) của token ━━━
    // Ý nghĩa: Kiểm tra token có bị giả mạo không
    try {
      const decoded = this.jwtService.verify(token);
      console.log('Token payload:', decoded); // Debug log
    } catch (error) {
      throw new BadRequestException('Invalid token signature');
    }

    // ━━━ BƯỚC 5: Kiểm tra bàn có active không ━━━
    // Ý nghĩa: Bàn inactive thì không cho order
    if (table.status !== 'active') {
      throw new BadRequestException('This table is currently unavailable');
    }

    // ━━━ BƯỚC 6: Get real menu from database ━━━
    // For now, use a fixed restaurant ID. In production, this should come from the table or token
    const restaurantId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    const menuData = await this.menuService.getGuestMenu(restaurantId, {
      categoryId,
      search,
      chefRecommended: chefRecommended === 'true',
      sortBy,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    return {
      success: true,
      message: `Welcome to ${table.table_number}!`,
      tableInfo: {
        id: table.id,
        number: table.table_number,
        capacity: table.capacity,
        location: table.location,
      },
      ...menuData,
    };
  }
}
