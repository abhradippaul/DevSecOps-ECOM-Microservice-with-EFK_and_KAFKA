import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Currency } from '../enum/currency-enum';

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

    @Prop()
    items: Items[]

    @Prop({ default: 0 })
    totalItems: number

    @Prop({ default: 0 })
    totalPrice: number

    @Prop({
        required: true,
        enum: Currency,
        default: Currency.USD,
    })
    currency: string
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ customerId: 1 }, { unique: true });