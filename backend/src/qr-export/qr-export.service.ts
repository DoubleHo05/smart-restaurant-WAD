import { Injectable, StreamableFile } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import archiver from 'archiver';
import { Response } from 'express';
import { Table } from '@prisma/client';

@Injectable()
export class QrExportService {
  // 1. Tạo 1 file PDF cho 1 bàn
  async generateTablePdf(table: Table, res: Response) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Thiết lập Header phản hồi để trình duyệt hiểu là file PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Table-${table.table_number}.pdf`,
    });

    doc.pipe(res); // Ghi dữ liệu trực tiếp vào response

    // --- Vẽ nội dung PDF ---
    // Logo hoặc Tiêu đề
    doc.fontSize(25).text('Smart Restaurant', { align: 'center' });
    doc.moveDown();

    // Số bàn
    doc.fontSize(20).text(`Table: ${table.table_number}`, { align: 'center' });
    doc.moveDown();

    // Sinh ảnh QR từ URL đầy đủ
    const frontendUrl = process.env.FRONTEND_MENU_URL;
    if (!frontendUrl) {
      throw new Error(
        'FRONTEND_MENU_URL environment variable is required for QR code generation',
      );
    }
    const qrUrl = `${frontendUrl}?table=${table.id}&token=${table.qr_token}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 300,
      errorCorrectionLevel: 'H',
    });

    // Chèn ảnh QR vào giữa trang (QR height = 300px)
    const qrYPosition = 150;
    doc.image(qrDataUrl, (doc.page.width - 300) / 2, qrYPosition, {
      width: 300,
    });

    // Hướng dẫn bên dưới QR (QR kết thúc ở Y = 150 + 300 = 450)
    doc
      .fontSize(14)
      .text('Scan to order', (doc.page.width - 300) / 2, qrYPosition + 320, {
        align: 'center',
        width: 300,
      });

    doc.end();
  }

  // 1.1 Tạo 1 file PNG cho 1 bàn
  async generateTablePng(table: Table, res: Response) {
    const frontendUrl = process.env.FRONTEND_MENU_URL;
    if (!frontendUrl) {
      throw new Error(
        'FRONTEND_MENU_URL environment variable is required for QR code generation',
      );
    }
    const qrUrl = `${frontendUrl}?table=${table.id}&token=${table.qr_token}`;

    const buffer = await QRCode.toBuffer(qrUrl, {
      width: 500,
      errorCorrectionLevel: 'H',
    });

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename=Table-${table.table_number}.png`,
    });

    res.send(buffer);
  }

  // 2. Tạo file ZIP chứa tất cả QR Code (dạng ảnh PNG)
  async generateAllQrZip(tables: Table[], res: Response) {
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Nén mức cao nhất
    });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=All-QR-Codes.zip',
    });

    archive.pipe(res);

    // Duyệt qua danh sách bàn và thêm file vào zip
    const frontendUrl = process.env.FRONTEND_MENU_URL;
    if (!frontendUrl) {
      throw new Error(
        'FRONTEND_MENU_URL environment variable is required for QR code generation',
      );
    }

    for (const table of tables) {
      // Tạo QR từ URL đầy đủ
      const qrUrl = `${frontendUrl}?table=${table.id}&token=${table.qr_token}`;
      const buffer = await QRCode.toBuffer(qrUrl, {
        width: 500,
        errorCorrectionLevel: 'H',
      });

      // Thêm vào file zip với tên: Table-1.png
      archive.append(buffer, { name: `Table-${table.table_number}.png` });
    }

    await archive.finalize();
  }
}
