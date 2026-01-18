import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'apps/common/enum/order/order-status.enum';
import { OrderItemDto } from 'apps/common/dto/order/order-item-dto';

export class CreateOrderDto {

    @IsNotEmpty()
    customerId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsEnum(OrderStatus)
    status: OrderStatus;
}
