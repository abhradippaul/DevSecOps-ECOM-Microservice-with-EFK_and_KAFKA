import { Type } from "class-transformer"
import { CurrencyType } from "apps/common/enum/payment/currency-type.enum"
import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator"
import { OrderItemDto } from "../../../dto/order/order-item-dto"

export class OrderCreatedQueueDto {
    @IsEnum(CurrencyType)
    currency: string

    @IsString()
    @IsNotEmpty()
    customerId: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}
