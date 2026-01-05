import { Module } from '@nestjs/common';
import { QrExportService } from './qr-export.service';
import { QrExportController } from './qr-export.controller';
import { TablesModule } from '../tables/tables.module'; // 👈 Import Module của TV1

@Module({
  imports: [TablesModule],
  controllers: [QrExportController],
  providers: [QrExportService],
})
export class QrExportModule {}
