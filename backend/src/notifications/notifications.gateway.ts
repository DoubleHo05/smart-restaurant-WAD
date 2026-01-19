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
    { userId: string | null; roles: string[] }
  >();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract JWT token from handshake auth
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        // Allow anonymous connections (guest customers)
        this.logger.log(`Anonymous client connected: ${client.id}`);
        this.connectedClients.set(client.id, {
          userId: null,
          roles: ['guest'],
        });
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

  // Notify customer when order is served
  async notifyOrderServed(order: any) {
    if (order.customer_id) {
      this.emitToUser(order.customer_id, 'order_status_update', {
        order_id: order.id,
        status: 'served',
        message: 'Your order has been served. Enjoy your meal!',
        timestamp: new Date().toISOString(),
      });
    }

    this.logger.log(`Notified customer: Order ${order.order_number} served`);
  }

  //Notify about order rejection
  async notifyOrderRejected(order: any, reason: string) {
    const notification = {
      type: 'order_rejected',
      title: 'Order Rejected',
      message: `Order #${order.order_number} was rejected`,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        reason,
      },
      timestamp: new Date().toISOString(),
    };

    // Notify customer
    if (order.customer_id) {
      this.emitToUser(order.customer_id, 'order_rejected', notification);
    }

    // Notify admins
    this.emitToRole('admin', 'order_rejected', notification);

    this.logger.log(`Notified: Order ${order.order_number} rejected`);
  }

  /**
   * ============================================
   * PHASE 4: PAYMENT NOTIFICATIONS
   * ============================================
   */

  // Notify when bill request is created
  async notifyBillRequestCreated(billRequest: any) {
    const notification = {
      type: 'bill_request_created',
      title: 'Bill Request',
      message: `Table ${billRequest.tables?.table_number || 'N/A'} requested bill`,
      data: {
        bill_request_id: billRequest.id,
        table_id: billRequest.table_id,
        table_number: billRequest.tables?.table_number,
        total_amount: billRequest.total_amount,
        payment_method: billRequest.payment_method,
        order_count: billRequest.order_ids?.length || 0,
      },
      timestamp: new Date().toISOString(),
    };

    // Notify all waiters
    this.emitToRole('waiter', 'bill_request_created', notification);

    // Notify admins
    this.emitToRole('admin', 'bill_request_created', notification);

    this.logger.log(`Notified: Bill request ${billRequest.id} created`);
  }

  // Notify when payment is completed
  async notifyPaymentCompleted(payment: any, billRequest: any) {
    const notification = {
      type: 'payment_completed',
      title: 'Payment Completed',
      message: `Payment of ${payment.amount.toLocaleString()} VND completed`,
      data: {
        payment_id: payment.id,
        bill_request_id: billRequest.id,
        table_id: billRequest.table_id,
        table_number: billRequest.tables?.table_number,
        amount: payment.amount,
        payment_method: billRequest.payment_method,
        transaction_no: payment.gateway_trans_id,
        completed_at: payment.completed_at,
      },
      timestamp: new Date().toISOString(),
    };

    // Notify waiters
    this.emitToRole('waiter', 'payment_completed', notification);

    // Notify admins
    this.emitToRole('admin', 'payment_completed', notification);

    // Notify customer who made payment
    if (billRequest.customer_id) {
      this.emitToUser(billRequest.customer_id, 'payment_completed', {
        type: 'payment_success',
        title: 'Payment Successful',
        message: 'Your payment has been completed successfully',
        data: {
          payment_id: payment.id,
          amount: payment.amount,
          payment_method: billRequest.payment_method,
          change: payment.change_amount || 0,
        },
        timestamp: new Date().toISOString(),
      });
    }
    
    // Also broadcast to all (for anonymous customers)
    this.emitToAll('payment_completed', {
      bill_request_id: billRequest.id,
      payment_id: payment.id,
      type: 'payment_success',
      title: 'Payment Successful',
      message: 'Your payment has been completed successfully',
      data: {
        payment_id: payment.id,
        amount: payment.amount,
        payment_method: billRequest.payment_method_code,
        change: payment.change_amount || 0,
      },
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Notified: Payment ${payment.id} completed`);
  }

  // Notify when payment fails
  async notifyPaymentFailed(payment: any, billRequest: any, reason: string) {
    const notification = {
      type: 'payment_failed',
      title: 'Payment Failed',
      message: `Payment failed: ${reason}`,
      data: {
        payment_id: payment.id,
        bill_request_id: billRequest.id,
        table_id: billRequest.table_id,
        table_number: billRequest.table?.table_number,
        amount: payment.amount,
        payment_method: billRequest.payment_method,
        reason,
      },
      timestamp: new Date().toISOString(),
    };

    // Notify waiters
    this.emitToRole('waiter', 'payment_failed', notification);

    // Notify customer
    if (billRequest.customer_id) {
      this.emitToUser(billRequest.customer_id, 'payment_failed', {
        type: 'payment_error',
        title: 'Payment Failed',
        message: reason,
        data: {
          payment_id: payment.id,
          bill_request_id: billRequest.id,
        },
        timestamp: new Date().toISOString(),
      });
    }

    this.logger.log(`Notified: Payment ${payment.id} failed`);
  }
}
