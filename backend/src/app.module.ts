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
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { CustomersModule } from './customers/customers.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { BillRequestsModule } from './bill-requests/bill-requests.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WaiterModule } from './waiter/waiter.module';
import { KitchenModule } from './kitchen/kitchen.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { PaymentsModule } from './payments/payments.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { RestaurantStaffModule } from './restaurant-staff/restaurant-staff.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RestaurantsModule,
    TablesModule,
    QrTokenModule,
    QrExportModule,
    MenuModule,
    MenuPhotosModule,
    CategoriesModule,
    ModifierGroupsModule,
    MenuItemsModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    CartModule,
    OrdersModule,
    BillRequestsModule,
    ReviewsModule,
    WaiterModule,
    KitchenModule,
    NotificationsModule,
    ReportsModule,
    PaymentsModule,
    SuperAdminModule,
    RestaurantStaffModule,
    PaymentMethodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
