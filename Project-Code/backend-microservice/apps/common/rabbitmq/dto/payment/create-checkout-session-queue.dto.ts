import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator"
import { OrderItemDto } from "../../../dto/order/order-item-dto"

export class CreateCheckoutSessionQueueDto {
    @IsString()
    @IsNotEmpty()
    currency: string

    @IsString()
    @IsNotEmpty()
    customerId: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}
