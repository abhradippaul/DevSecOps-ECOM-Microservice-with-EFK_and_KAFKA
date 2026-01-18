import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class OrderItemDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0)
    price: number;
}
