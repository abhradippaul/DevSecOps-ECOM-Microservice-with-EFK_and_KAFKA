import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class AddProdcutToCartDto {
    @IsNotEmpty()
    @IsString()
    productId: string

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    quantity: number

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    price: number
}