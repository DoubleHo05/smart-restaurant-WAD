import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillRequestDto } from './dto/create-bill-request.dto';
import { AcceptBillRequestDto } from './dto/accept-bill-request.dto';

@Injectable()
export class BillRequestsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a bill request by aggregating all unpaid orders for a table
     */
    async create(createDto: CreateBillRequestDto) {
        // 1. Validate table exists
        const table = await this.prisma.table.findUnique({
            where: { id: createDto.table_id },
            include: { restaurant: true },
        });

        if (!table) {
            throw new NotFoundException('Table not found');
        }

        // 2. Check if there's already an active bill request for this table
        const existingBillRequest = await this.prisma.bill_requests.findFirst({
            where: {
                table_id: createDto.table_id,
                status: { in: ['pending', 'accepted'] },
            },
        });

        if (existingBillRequest) {
            throw new BadRequestException(
                'There is already an active bill request for this table',
            );
        }

        // 3. Get all unpaid orders for this table
        const orders = await this.prisma.order.findMany({
            where: {
                table_id: createDto.table_id,
                status: {
                    notIn: ['completed', 'cancelled', 'rejected'],
                },
            },
            include: {
                order_items: {
                    include: {
                        menu_item: true,
                        modifiers: {
                            include: {
                                modifier_option: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: 'asc',
            },
        });

        if (orders.length === 0) {
            throw new BadRequestException('No unpaid orders found for this table');
        }

        // 4. Calculate subtotal from all orders
        const subtotal = orders.reduce((sum, order) => {
            return sum + Number(order.total);
        }, 0);

        // 5. Calculate total amount
        const tipsAmount = createDto.tips_amount || 0;
        const totalAmount = subtotal + tipsAmount;

        // 6. Create bill request
        const orderIds = orders.map((order) => order.id);

        const billRequest = await this.prisma.bill_requests.create({
            data: {
                restaurant_id: table.restaurant_id,
                table_id: createDto.table_id,
                payment_method_code: createDto.payment_method_code,
                subtotal,
                tips_amount: tipsAmount,
                total_amount: totalAmount,
                order_ids: orderIds,
                customer_note: createDto.customer_note,
                status: 'pending',
            },
        });

        console.log('🧾 [Bill Request] Created:', {
            id: billRequest.id,
            table_id: createDto.table_id,
            total_amount: totalAmount,
            order_count: orders.length,
        });

        // 7. Return bill request with full details
        return this.findOne(billRequest.id);
    }

    /**
     * Get bill request details with orders and payment method
     */
    async findOne(id: string) {
        const billRequest = await this.prisma.bill_requests.findUnique({
            where: { id },
            include: {
                tables: {
                    select: {
                        id: true,
                        table_number: true,
                        location: true,
                    },
                },
                restaurants: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                users: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                    },
                },
            },
        });

        if (!billRequest) {
            throw new NotFoundException('Bill request not found');
        }

        // Get payment method details
        const paymentMethod = await this.prisma.payment_methods.findUnique({
            where: { code: billRequest.payment_method_code },
        });

        // Get orders
        const orderIds = billRequest.order_ids as string[];
        const orders = await this.prisma.order.findMany({
            where: {
                id: { in: orderIds },
            },
            include: {
                order_items: {
                    include: {
                        menu_item: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                            },
                        },
                        modifiers: {
                            include: {
                                modifier_option: {
                                    select: {
                                        id: true,
                                        name: true,
                                        price_adjustment: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: 'asc',
            },
        });

        return {
            ...billRequest,
            payment_method: paymentMethod,
            orders,
        };
    }

    /**
     * Get active bill request for a table (if any)
     */
    async findActiveByTable(tableId: string) {
        const billRequest = await this.prisma.bill_requests.findFirst({
            where: {
                table_id: tableId,
                status: { in: ['pending', 'accepted'] },
            },
            include: {
                tables: {
                    select: {
                        id: true,
                        table_number: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        if (!billRequest) {
            return null;
        }

        return this.findOne(billRequest.id);
    }

    /**
     * Waiter accepts bill request
     */
    async accept(id: string, acceptDto: AcceptBillRequestDto) {
        const billRequest = await this.prisma.bill_requests.findUnique({
            where: { id },
        });

        if (!billRequest) {
            throw new NotFoundException('Bill request not found');
        }

        if (billRequest.status !== 'pending') {
            throw new BadRequestException(
                `Cannot accept bill request with status "${billRequest.status}"`,
            );
        }

        const updated = await this.prisma.bill_requests.update({
            where: { id },
            data: {
                status: 'accepted',
                accepted_by: acceptDto.accepted_by,
                accepted_at: new Date(),
            },
        });

        console.log('✅ [Bill Request] Accepted:', {
            id,
            accepted_by: acceptDto.accepted_by,
        });

        return this.findOne(id);
    }

    /**
     * Cancel bill request
     */
    async cancel(id: string) {
        const billRequest = await this.prisma.bill_requests.findUnique({
            where: { id },
        });

        if (!billRequest) {
            throw new NotFoundException('Bill request not found');
        }

        if (billRequest.status === 'completed') {
            throw new BadRequestException('Cannot cancel completed bill request');
        }

        await this.prisma.bill_requests.update({
            where: { id },
            data: {
                status: 'cancelled',
            },
        });

        console.log('❌ [Bill Request] Cancelled:', id);

        return { message: 'Bill request cancelled successfully' };
    }
}
