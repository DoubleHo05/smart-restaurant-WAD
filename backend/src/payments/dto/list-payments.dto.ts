import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ListPaymentsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string; // Search by bill_request_id, payment ID

  @IsOptional()
  @IsIn(['pending', 'completed', 'failed'])
  status?: string;

  @IsOptional()
  @IsString()
  method?: string; // momo, zalopay, vnpay, cash

  @IsOptional()
  @IsString()
  start_date?: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  end_date?: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  restaurant_id?: string; // Filter by restaurant
}
