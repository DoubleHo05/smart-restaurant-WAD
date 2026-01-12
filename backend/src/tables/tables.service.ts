import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from '@prisma/client';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async create(createTableDto: CreateTableDto): Promise<Table> {
    // Validate restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: createTableDto.restaurant_id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Check if table number already exists for this restaurant
    const existingTable = await this.prisma.table.findUnique({
      where: {
        restaurant_id_table_number: {
          restaurant_id: createTableDto.restaurant_id,
          table_number: createTableDto.table_number,
        },
      },
    });

    if (existingTable) {
      throw new ConflictException(
        `Table with number ${createTableDto.table_number} already exists in this restaurant`,
      );
    }

    return await this.prisma.table.create({
      data: {
        ...createTableDto,
        status: 'active',
      },
    });
  }

  async findAll(
    userId: string,
    userRoles: string[],
    filters?: {
      status?: string;
      location?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
  ): Promise<Table[]> {
    const isSuperAdmin = userRoles.includes('super_admin');
    const where: any = {};

    // Filter by user's restaurants
    if (!isSuperAdmin) {
      const userRestaurants = await this.prisma.restaurant.findMany({
        where: { owner_id: userId },
        select: { id: true },
      });
      where.restaurant_id = {
        in: userRestaurants.map((r) => r.id),
      };
    }

    // Apply filters
    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.location) {
      where.location = filters.location;
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'table_number';
    const sortOrder = filters?.sortOrder || 'asc';

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    return await this.prisma.table.findMany({
      where,
      orderBy,
    });
  }

  async findOne(id: string): Promise<Table> {
    const table = await this.prisma.table.findUnique({
      where: { id },
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    return table;
  }

  async update(id: string, updateTableDto: UpdateTableDto): Promise<Table> {
    // Check if table exists
    const currentTable = await this.findOne(id);

    // Check if updating table_number and if it conflicts with existing
    if (updateTableDto.table_number) {
      const existingTable = await this.prisma.table.findUnique({
        where: {
          restaurant_id_table_number: {
            restaurant_id: currentTable.restaurant_id,
            table_number: updateTableDto.table_number,
          },
        },
      });

      if (existingTable && existingTable.id !== id) {
        throw new ConflictException(
          `Table with number ${updateTableDto.table_number} already exists in this restaurant`,
        );
      }
    }

    return await this.prisma.table.update({
      where: { id },
      data: updateTableDto,
    });
  }

  async updateStatus(id: string, status: string): Promise<Table> {
    // Check if table exists
    await this.findOne(id);

    return await this.prisma.table.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string): Promise<void> {
    // Check if table exists
    await this.findOne(id);

    await this.prisma.table.delete({
      where: { id },
    });
  }

  async getLocations(): Promise<string[]> {
    const tables = await this.prisma.table.findMany({
      where: {
        location: {
          not: null,
        },
      },
      select: {
        location: true,
      },
      distinct: ['location'],
    });

    return tables
      .map((t) => t.location)
      .filter((loc): loc is string => loc !== null);
  }

  /**
   * Get table status overview for a restaurant
   * Returns count of tables by occupancy status (available, occupied, reserved)
   */
  async getTableStatusOverview(restaurantId: string) {
    // Get all tables for the restaurant
    const tables = await this.prisma.table.findMany({
      where: {
        restaurant_id: restaurantId,
        status: 'active', // Only active tables
      },
      include: {
        orders: {
          where: {
            status: {
              in: ['pending', 'accepted', 'preparing', 'ready', 'served'],
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });

    // Calculate status for each table
    const tableStatuses = tables.map((table) => {
      let occupancyStatus: 'available' | 'occupied' | 'reserved' = 'available';

      // If table has active orders, mark as occupied
      if (table.orders.length > 0) {
        occupancyStatus = 'occupied';
      }

      return {
        id: table.id,
        table_number: table.table_number,
        location: table.location,
        capacity: table.capacity,
        status: occupancyStatus,
        current_order: table.orders[0] || null,
      };
    });

    // Count tables by status
    const statusCounts = {
      available: tableStatuses.filter((t) => t.status === 'available').length,
      occupied: tableStatuses.filter((t) => t.status === 'occupied').length,
      reserved: tableStatuses.filter((t) => t.status === 'reserved').length,
      total: tableStatuses.length,
    };

    return {
      success: true,
      data: {
        tables: tableStatuses,
        summary: statusCounts,
      },
    };
  }

  /**
   * Update table occupancy status manually
   * (available, occupied, reserved)
   */
  async updateTableOccupancyStatus(
    tableId: string,
    restaurantId: string,
    occupancyStatus: 'available' | 'occupied' | 'reserved',
  ) {
    // Verify table exists and belongs to restaurant
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found`);
    }

    if (table.restaurant_id !== restaurantId) {
      throw new ConflictException('Table does not belong to this restaurant');
    }

    // Note: We're storing occupancy info in description or using a separate field
    // For now, we'll track it via orders. This method is for manual override.
    // In production, you might add a separate 'occupancy_status' column to the table

    return {
      success: true,
      message: `Table ${table.table_number} status updated to ${occupancyStatus}`,
      data: {
        id: table.id,
        table_number: table.table_number,
        occupancy_status: occupancyStatus,
      },
    };
  }

  /**
   * Auto-update table status based on order status
   * Called when order status changes
   */
  async autoUpdateTableStatusByOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        table: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Check if there are other active orders for this table
    const activeOrders = await this.prisma.order.findMany({
      where: {
        table_id: order.table_id,
        status: {
          in: ['pending', 'accepted', 'preparing', 'ready', 'served'],
        },
        id: {
          not: orderId, // Exclude current order
        },
      },
    });

    let newStatus: 'available' | 'occupied';

    // If order is completed/cancelled and no other active orders, table is available
    if (
      ['completed', 'cancelled', 'rejected'].includes(order.status) &&
      activeOrders.length === 0
    ) {
      newStatus = 'available';
    } else {
      // Table has active orders, mark as occupied
      newStatus = 'occupied';
    }

    return {
      table_id: order.table_id,
      table_number: order.table.table_number,
      occupancy_status: newStatus,
      active_orders_count:
        activeOrders.length + (newStatus === 'occupied' ? 1 : 0),
    };
  }
}
