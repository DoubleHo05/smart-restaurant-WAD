import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { PublicMenuController } from './public-menu.controller';
import { PublicMenuService } from './public-menu.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      // ← Cấu hình giống QrTokenModule
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [MenuController, PublicMenuController],
  providers: [MenuService, PublicMenuService],
  exports: [PublicMenuService],
})
export class MenuModule {}
