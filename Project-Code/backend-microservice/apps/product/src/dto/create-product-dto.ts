import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

import { ProductSize } from "../constants";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    short_description: string

    @IsString()
    description: string

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    price: number;

    @IsArray()
    @IsEnum(ProductSize, { each: true })
    sizes: ProductSize[];

    @IsArray()
    @IsString({ each: true })
    colors: string[];

    @IsObject()
    images: Object

    @IsString()
    @IsOptional()
    category_slug: string
}