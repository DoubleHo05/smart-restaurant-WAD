import {
  IsString,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateTableDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Restaurant ID is required' })
  restaurant_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Table number is required' })
  @MaxLength(50, { message: 'Table number must not exceed 50 characters' })
  table_number: string;

  @IsInt({ message: 'Capacity must be an integer' })
  @Min(1, { message: 'Capacity must be at least 1' })
  @Max(20, { message: 'Capacity must not exceed 20' })
  capacity: number;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Location must not exceed 100 characters' })
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
