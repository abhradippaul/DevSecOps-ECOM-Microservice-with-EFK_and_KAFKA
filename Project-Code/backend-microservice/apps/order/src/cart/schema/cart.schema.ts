import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ _id: false })
class Items {
    @Prop({ required: true })
    productId: string;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true, min: 1 })
    price: number;
}

@Schema({ timestamps: true, _id: false })
export class Cart {
    @Prop({ required: true, unique: true })
    customerId: string;

    @Prop({ required: true })
    items: Items[]
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ customerId: 1 }, { unique: true });