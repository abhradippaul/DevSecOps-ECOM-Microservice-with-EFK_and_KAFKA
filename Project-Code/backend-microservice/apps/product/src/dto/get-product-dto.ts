import { Type } from 'class-transformer';
import {
    IsOptional,
    IsString,
    IsNumber,
    Min,
} from 'class-validator';

export class GetProductsQueryDto {
    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(5)
    limit?: number;
}
