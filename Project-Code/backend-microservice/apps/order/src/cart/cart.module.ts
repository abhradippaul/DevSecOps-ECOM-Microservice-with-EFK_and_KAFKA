import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartConsumerService } from '../rabbitmq/consumer/cart/cart-consumer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
        ClientsModule.register([
            {
                name: 'PRODUCT_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost', // or localhost in dev
                    port: Number(process.env.PRODUCT_SERVICE_PORT),
                },
            },
        ]),
    ],
    controllers: [CartController],
    providers: [CartService, CartConsumerService],
    exports: [CartService, MongooseModule]
})
export class CartModule { }
