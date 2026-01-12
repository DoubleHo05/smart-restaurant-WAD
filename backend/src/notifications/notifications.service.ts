import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(data: {
    user_id: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    return this.prisma.notifications.create({
      data: {
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
        is_read: false,
      },
    });
  }
}
