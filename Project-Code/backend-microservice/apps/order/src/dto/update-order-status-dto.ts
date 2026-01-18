import { OrderStatus } from 'apps/common/enum/order/order-status.enum';
import {
    IsEnum
} from 'class-validator';

export class UpdateOrderStatusDto {

    @IsEnum(OrderStatus)
    status: OrderStatus;
}
