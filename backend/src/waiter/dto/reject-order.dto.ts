import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Rejection reason is required' })
  @MaxLength(500, {
    message: 'Rejection reason must not exceed 500 characters',
  })
  reason: string;
}
