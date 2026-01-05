import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateModifierOptionDto {
  @IsString()
  @Length(2, 80)
  name: string;
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price_adjustment: number;
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}
