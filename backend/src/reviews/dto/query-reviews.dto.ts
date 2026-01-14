import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
    NEWEST = 'newest',
    OLDEST = 'oldest',
    HIGHEST = 'highest',
    LOWEST = 'lowest',
}

export class QueryReviewsDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsEnum(SortOrder)
    sort?: SortOrder = SortOrder.NEWEST;
}
