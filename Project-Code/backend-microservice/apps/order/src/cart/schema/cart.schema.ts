import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CurrencyType } from 'apps/common/enum/payment/currency-type.enum';
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

@Schema({ timestamps: true })
export class Cart {

    @Prop()
    items: Items[]

    @Prop({ default: 0 })
    totalItems: number

    @Prop({ default: 0 })
    totalPrice: number

    @Prop({ required: true })
    userId: string

    @Prop({
        required: true,
        enum: CurrencyType,
        default: CurrencyType.USD,
    })
    currency: string
}

export const CartSchema = SchemaFactory.createForClass(Cart);