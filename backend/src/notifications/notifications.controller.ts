import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  /**
   * Get user's notifications (with pagination)
   */
  @Get()
  async getUserNotifications(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const userId = req.user.sub;
    const notifications = await this.notificationsService.getUserNotifications(
      userId,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
    );

    const unreadCount = await this.notificationsService.getUnreadCount(userId);

    return {
      notifications,
      unread_count: unreadCount,
      total: notifications.length,
    };
  }

  /**
   * Get unread count
   */
  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const userId = req.user.sub;
    const count = await this.notificationsService.getUnreadCount(userId);
    return { unread_count: count };
  }

  /**
   * Mark notification as read
   */
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    await this.notificationsService.markAsRead(id, userId);
    return { success: true, message: 'Notification marked as read' };
  }

  /**
   * Mark all notifications as read
   */
  @Patch('read-all')
  async markAllAsRead(@Request() req) {
    const userId = req.user.sub;
    await this.notificationsService.markAllAsRead(userId);
    return { success: true, message: 'All notifications marked as read' };
  }

  /**
   * Delete notification
   */
  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    await this.notificationsService.deleteNotification(id, userId);
    return { success: true, message: 'Notification deleted' };
  }
}
