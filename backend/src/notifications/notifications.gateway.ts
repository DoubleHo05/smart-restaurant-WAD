import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
    ],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedClients = new Map<
    string,
    { userId: string; roles: string[] }
  >();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract JWT token from handshake auth
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      this.connectedClients.set(client.id, {
        userId: payload.sub,
        roles: payload.roles || [],
      });

      // Join user-specific room
      client.join(`user:${payload.sub}`);

      // Join role-based rooms
      if (payload.roles) {
        payload.roles.forEach((role: string) => {
          client.join(`role:${role}`);
        });
      }

      this.logger.log(
        `Client connected: ${client.id} | User: ${
          payload.sub
        } | Roles: ${payload.roles?.join(', ')}`,
      );
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    const clientInfo = this.connectedClients.get(client.id);
    this.logger.log(
      `Client disconnected: ${client.id} | User: ${clientInfo?.userId}`,
    );
    this.connectedClients.delete(client.id);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  // Emit notification to specific role (waiter, kitchen, admin)
  emitToRole(role: string, event: string, data: any) {
    this.server.to(`role:${role}`).emit(event, data);
  }

  // Emit to all clients
  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Subscribe to test connection
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): string {
    return 'pong';
  }

  //Notify waiters about new order
  async notifyNewOrder(order: any) {
    const notification = {
      type: 'new_order',
      title: 'New Order Received',
      message: `New order #${order.order_number} from Table ${order.table.table_number}`,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        table_number: order.table.table_number,
        total: order.total,
        items_count: order.order_items.length,
      },
      timestamp: new Date().toISOString(),
    };

    // Emit to all waiters
    this.emitToRole('waiter', 'new_order', notification);

    // Also emit to admins
    this.emitToRole('admin', 'new_order', notification);

    this.logger.log(`Notified waiters: New order ${order.order_number}`);
  }
  // Notify kitchen when order is accepted

  async notifyOrderAccepted(order: any) {
    const notification = {
      type: 'order_accepted',
      title: 'Order Accepted',
      message: `Order #${order.order_number} accepted - Start preparing`,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        table_number: order.table.table_number,
        items: order.order_items.map((item: any) => ({
          name: item.menu_item.name,
          quantity: item.quantity,
          modifiers: item.modifiers || [],
        })),
      },
      timestamp: new Date().toISOString(),
    };

    // Emit to kitchen staff
    this.emitToRole('kitchen', 'order_accepted', notification);

    // Notify customer
    if (order.customer_id) {
      this.emitToUser(order.customer_id, 'order_status_update', {
        order_id: order.id,
        status: 'accepted',
        message: 'Your order has been accepted',
      });
    }

    this.logger.log(`Notified kitchen: Order ${order.order_number} accepted`);
  }

  //Notify waiter when order is ready
  async notifyOrderReady(order: any) {
  const notification = {
    type: 'order_ready',
    title: 'Order Ready',
    message: `Order #${order.order_number} is ready to serve`,
    data: {
      order_id: order.id,
      order_number: order.order_number,
      table_number: order.table.table_number,
      prep_time_minutes: order.prep_time_minutes || 0,
    },
    timestamp: new Date().toISOString(),
  };

  // Emit to waiters
  this.emitToRole('waiter', 'order_ready', notification);

  // Notify customer
  if (order.customer_id) {
    this.emitToUser(order.customer_id, 'order_status_update', {
      order_id: order.id,
      status: 'ready',
      message: 'Your order is ready',
    });
  }

  this.logger.log(`Notified waiter: Order ${order.order_number} ready`);
}

}
