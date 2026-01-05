import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  Length,
  IsIn,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateItemDto {
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80, { message: 'Name must be between 2 and 80 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Price must be greater than 0' })
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(240, { message: 'Preparation time cannot exceed 240 minutes' })
  @Type(() => Number)
  prep_time_minutes?: number;

  @IsOptional()
  @IsString()
  @IsIn(['available', 'unavailable', 'sold_out'], {
    message: 'Status must be available, unavailable, or sold_out',
  })
  status?: string;

  @IsOptional()
  @IsBoolean()
  is_chef_recommended?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  modifier_group_ids?: string[];
}
