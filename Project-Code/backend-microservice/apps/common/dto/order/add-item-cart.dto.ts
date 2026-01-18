import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class AddItemToCartDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(1)
    price: number;
}