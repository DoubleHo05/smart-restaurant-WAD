import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { QrExportService } from './qr-export.service';
import { TablesService } from '../tables/tables.service';

@Controller('tables/qr')
export class QrExportController {
  constructor(
    private readonly qrExportService: QrExportService,
    private readonly tablesService: TablesService,
  ) { }

  // API Download PDF của 1 bàn
  @Get(':id/download-pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const table = await this.tablesService.findOne(id);

    if (!table) {
      throw new NotFoundException('Không tìm thấy bàn này');
    }

    // Nếu bàn chưa có token, có thể báo lỗi hoặc tự sinh token tạm (tùy logic)
    if (!table.qr_token) {
      throw new NotFoundException('Bàn này chưa được tạo mã QR');
    }
    return await this.qrExportService.generateTablePdf(table, res);
  }

  // API Download PNG của 1 bàn
  @Get(':id/download-png')
  async downloadPng(@Param('id') id: string, @Res() res: Response) {
    const table = await this.tablesService.findOne(id);

    if (!table) {
      throw new NotFoundException('Không tìm thấy bàn này');
    }

    if (!table.qr_token) {
      throw new NotFoundException('Bàn này chưa được tạo mã QR');
    }
    return await this.qrExportService.generateTablePng(table, res);
  }

  // API Download ZIP tất cả bàn
  @Get('download-all-zip')
  async downloadAllZip(@Res() res: Response) {
    const allTables = await this.tablesService.findAll();

    // Lọc chỉ lấy những bàn có QR Token và đang Active
    const activeTables = allTables.filter(
      (t) => t.qr_token && t.status === 'active',
    );

    if (activeTables.length === 0) {
      throw new NotFoundException('Không có bàn nào hợp lệ để tải');
    }

    return await this.qrExportService.generateAllQrZip(activeTables, res);
  }
}
