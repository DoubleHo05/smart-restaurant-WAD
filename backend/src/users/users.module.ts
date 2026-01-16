import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RestaurantStaffModule } from '../restaurant-staff/restaurant-staff.module';

@Module({
  imports: [PrismaModule, RestaurantStaffModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
