import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator"

class ProductItemDto {
    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    @IsString()
    productId: string

    @IsNotEmpty()
    quantity: number
}

export class OrderCreatedDto {
    @IsString()
    @IsNotEmpty()
    currency: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductItemDto)
    items: ProductItemDto[]
}