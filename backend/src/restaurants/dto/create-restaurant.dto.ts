import { IsString, IsOptional, MaxLength, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Owner ID is required' })
  owner_id: string;
}
