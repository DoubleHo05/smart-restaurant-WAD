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
}
