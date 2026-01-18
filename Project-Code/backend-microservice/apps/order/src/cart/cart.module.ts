import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartConsumerService } from '../rabbitmq/consumer/cart/cart-consumer.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ],
    controllers: [CartController],
    providers: [CartService, CartConsumerService],
    exports: [CartService, MongooseModule]
})
export class CartModule { }
