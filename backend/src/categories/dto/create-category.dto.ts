import {
  IsString,
  IsOptional,
  IsInt,
  IsIn,
  Length,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
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
