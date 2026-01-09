import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TablesModule } from './tables/tables.module';
import { QrTokenModule } from './qr-token/qr-token.module';
import { QrExportModule } from './qr-export/qr-export.module';
import { MenuModule } from './menu/menu.module';
import { MenuPhotosModule } from './menu-photos/menu-photos.module';
import { CategoriesModule } from './categories/categories.module';
import { ModifierGroupsModule } from './modifier-groups/modifier-groups.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TablesModule,
    QrTokenModule,
    QrExportModule,
    MenuModule,
    MenuPhotosModule,
    CategoriesModule,
    ModifierGroupsModule,
    MenuItemsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
