import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    productId: string

    @IsNotEmpty()
    @IsString()
    customerId: string

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @IsNotEmpty()
    @IsString()
    status: string
}