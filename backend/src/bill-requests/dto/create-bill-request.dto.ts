import { IsString, IsUUID, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBillRequestDto {
    @IsUUID()
    table_id: string;

    @IsString()
    payment_method_code: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    tips_amount?: number;

    @IsString()
    @IsOptional()
    customer_note?: string;
}
