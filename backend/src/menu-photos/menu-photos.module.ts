import { Module } from '@nestjs/common';
import { MenuPhotosController } from './menu-photos.controller';
import { MenuPhotosService } from './menu-photos.service';
import { StorageTestController } from './storage-test.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MenuPhotosController, StorageTestController],
  providers: [MenuPhotosService],
})
export class MenuPhotosModule {}
