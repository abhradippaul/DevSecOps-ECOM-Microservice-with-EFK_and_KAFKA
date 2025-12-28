import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    productId: string

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @IsNotEmpty()
    @IsString()
    customerId: string
}