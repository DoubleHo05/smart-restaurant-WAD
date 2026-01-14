import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    ValidationPipe,
} from '@nestjs/common';
import { BillRequestsService } from './bill-requests.service';
import { CreateBillRequestDto } from './dto/create-bill-request.dto';
import { AcceptBillRequestDto } from './dto/accept-bill-request.dto';

@Controller('api/bill-requests')
export class BillRequestsController {
    constructor(private readonly billRequestsService: BillRequestsService) { }

    /**
     * POST /api/bill-requests
     * Create a new bill request
     */
    @Post()
    async create(
        @Body(new ValidationPipe({ transform: true, whitelist: true }))
        createDto: CreateBillRequestDto,
    ) {
        return this.billRequestsService.create(createDto);
    }

    /**
     * GET /api/bill-requests/:id
     * Get bill request details
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.billRequestsService.findOne(id);
    }

    /**
     * GET /api/bill-requests/table/:tableId/active
     * Get active bill request for a table
     */
    @Get('table/:tableId/active')
    async findActiveByTable(@Param('tableId') tableId: string) {
        return this.billRequestsService.findActiveByTable(tableId);
    }

    /**
     * PATCH /api/bill-requests/:id/accept
     * Waiter accepts bill request
     */
    @Patch(':id/accept')
    async accept(
        @Param('id') id: string,
        @Body(new ValidationPipe({ transform: true, whitelist: true }))
        acceptDto: AcceptBillRequestDto,
    ) {
        return this.billRequestsService.accept(id, acceptDto);
    }

    /**
     * PATCH /api/bill-requests/:id/cancel
     * Cancel bill request
     */
    @Patch(':id/cancel')
    async cancel(@Param('id') id: string) {
        return this.billRequestsService.cancel(id);
    }
}
