import { Module } from '@nestjs/common';
import { MenuPhotosController } from './menu-photos.controller';
import { MenuPhotosService } from './menu-photos.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MenuPhotosController],
  providers: [MenuPhotosService],
})
export class MenuPhotosModule {}
