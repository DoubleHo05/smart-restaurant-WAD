import {
  IsString,
  IsOptional,
  IsInt,
  IsIn,
  Length,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateCategoryDto {
  @IsUUID()
  restaurant_id: string;

  @IsString()
  @Length(2, 50)
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsInt()
  @Min(0)
  display_order?: number;
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}
