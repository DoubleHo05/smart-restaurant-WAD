import { IsOptional, IsUUID } from 'class-validator';

export class PendingOrdersFilterDto {
  @IsOptional()
  @IsUUID()
  table_id?: string;
}
