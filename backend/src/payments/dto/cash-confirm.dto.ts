import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CashConfirmDto {
  @ApiProperty({
    example: 'payment-uuid',
    description: 'UUID of the payment record',
  })
  @IsString()
  @IsNotEmpty()
  payment_id: string;

  @ApiProperty({
    example: 500000,
    description: 'Amount received from customer in VND',
  })
  @IsNumber()
  @Min(0)
  received_amount: number;

  @ApiProperty({
    example: 'waiter-uuid',
    description: 'UUID of waiter confirming payment (auto-filled from JWT)',
  })
  @IsString()
  @IsNotEmpty()
  waiter_id: string;
}
