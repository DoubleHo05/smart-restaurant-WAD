import { IsUUID, IsString, IsOptional, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  order_id: string;

  @IsString()
  @IsIn(['momo', 'zalopay', 'vnpay', 'cash'])
  method: string; // Required: select payment method

  @IsString()
  @IsOptional()
  return_url?: string; // URL to redirect after payment (for online methods)
}
