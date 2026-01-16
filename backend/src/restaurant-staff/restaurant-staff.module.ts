import { Module } from '@nestjs/common';
import { RestaurantStaffController } from './restaurant-staff.controller';
import { RestaurantStaffService } from './restaurant-staff.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RestaurantStaffController],
  providers: [RestaurantStaffService],
  exports: [RestaurantStaffService],
})
export class RestaurantStaffModule {}
