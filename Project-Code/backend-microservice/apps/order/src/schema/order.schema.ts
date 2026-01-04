import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderStatus } from '../dto/order-status.enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {

    @Prop({ required: true })
    productId: string;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true, min: 0 })
    price: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {

    @Prop({ required: true })
    customerId: string;

    @Prop({ type: [OrderItemSchema], required: true })
    items: OrderItem[];

    @Prop({
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Prop({ required: true })
    totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
