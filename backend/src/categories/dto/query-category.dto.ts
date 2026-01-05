import { IsOptional, IsIn } from 'class-validator';
export class QueryCategoryDto {
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
  @IsOptional()
  @IsIn(['name', 'display_order', 'created_at'])
  sortBy?: string;
}
