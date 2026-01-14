import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class ZaloPayCallbackDto {
  @ApiProperty({ example: '2553' })
  @IsString()
  @IsNotEmpty()
  app_id: string;

  @ApiProperty({ example: '260114_payment-uuid' })
  @IsString()
  @IsNotEmpty()
  app_trans_id: string;

  @ApiProperty({ example: 1673654321000 })
  @IsNumber()
  app_time: number;

  @ApiProperty({ example: 'user123' })
  @IsString()
  app_user: string;

  @ApiProperty({ example: 400000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '{"payment_id":"uuid"}' })
  @IsString()
  embed_data: string;

  @ApiProperty({ example: '[]' })
  @IsString()
  item: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  zp_trans_id: string;

  @ApiProperty({ example: 1673654321000 })
  @IsNumber()
  server_time: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  channel: number;

  @ApiProperty({ example: 'merchant123' })
  @IsString()
  merchant_user_id: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  user_fee_amount: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  discount_amount: number;

  @ApiProperty({ example: 1, description: '1 = success' })
  @IsNumber()
  status: number;

  @ApiProperty({ example: 'abc123xyz' })
  @IsString()
  @IsNotEmpty()
  mac: string;
}
