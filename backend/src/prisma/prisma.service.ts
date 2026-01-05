import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Expose all Prisma models
  public table: PrismaClient['table'];
  public menuCategory: PrismaClient['menuCategory'];
  public menuItem: PrismaClient['menuItem'];
  public menuItemPhoto: PrismaClient['menuItemPhoto'];
  public modifierGroup: PrismaClient['modifierGroup'];
  public modifierOption: PrismaClient['modifierOption'];
  public menuItemModifierGroup: PrismaClient['menuItemModifierGroup'];

  private client: PrismaClient;
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    const adapter = new PrismaPg(this.pool);
    this.client = new PrismaClient({ adapter });

    // Initialize all models
    this.table = this.client.table;
    this.menuCategory = this.client.menuCategory;
    this.menuItem = this.client.menuItem;
    this.menuItemPhoto = this.client.menuItemPhoto;
    this.modifierGroup = this.client.modifierGroup;
    this.modifierOption = this.client.modifierOption;
    this.menuItemModifierGroup = this.client.menuItemModifierGroup;
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
    await this.pool.end();
  }
}
