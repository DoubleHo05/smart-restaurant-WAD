import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Expose all Prisma models
  public table;
  public menuCategory;
  public menuItem;
  public menuItemPhoto;
  public modifierGroup;
  public modifierOption;
  public menuItemModifierGroup;
  public user;
  public role;
  public userRole;
  public restaurant;
  public restaurantStaff;
  public order;
  public orderItem;
  public orderItemModifier;
  public cart;
  public cartItem;
  public cartItemModifier;
  public bill_requests;
  public payment_methods;
  public payments;
  public review;
  public notifications;

  private client: PrismaClient;
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20, // Maximum number of clients in the pool (default: 10)
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Return error after 10 seconds if no connection available
      allowExitOnIdle: false, // Keep pool alive
    });

    const adapter = new PrismaPg(this.pool);
    this.client = new PrismaClient({ adapter });

    // Initialize all models
    this.restaurant = this.client.restaurant;
    this.restaurantStaff = this.client.restaurantStaff;
    this.table = this.client.table;
    this.menuCategory = this.client.menuCategory;
    this.menuItem = this.client.menuItem;
    this.menuItemPhoto = this.client.menuItemPhoto;
    this.modifierGroup = this.client.modifierGroup;
    this.modifierOption = this.client.modifierOption;
    this.menuItemModifierGroup = this.client.menuItemModifierGroup;
    this.user = this.client.user;
    this.role = this.client.role;
    this.userRole = this.client.userRole;
    this.order = this.client.order;
    this.orderItem = this.client.orderItem;
    this.orderItemModifier = this.client.orderItemModifier;
    this.cart = this.client.cart;
    this.cartItem = this.client.cartItem;
    this.cartItemModifier = this.client.cartItemModifier;
    this.bill_requests = this.client.bill_requests;
    this.payment_methods = this.client.payment_methods;
    this.payments = this.client.payments;
    this.review = this.client.review;
    this.notifications = this.client.notifications;
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
    await this.pool.end();
  }

  // Expose $transaction method
  get $transaction() {
    return this.client.$transaction.bind(this.client);
  }
}
