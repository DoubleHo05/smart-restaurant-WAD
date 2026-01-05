import { IsOptional, IsString, IsIn, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryItemsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsIn(['available', 'unavailable', 'sold_out'])
  status?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  is_chef_recommended?: string;

  @IsOptional()
  @IsIn([
    'name_asc',
    'name_desc',
    'price_asc',
    'price_desc',
    'created_at_asc',
    'created_at_desc',
  ])
  sortBy?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
