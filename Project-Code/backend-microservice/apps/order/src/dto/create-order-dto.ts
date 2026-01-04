import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item-dto';
import { OrderStatus } from './order-status.enum';

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
