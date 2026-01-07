import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.development"
    }),
    MongooseModule.forRoot(process.env.ORDER_SERVICE_MONGODB_URL!),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: 'order_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    RabbitMQModule,
    CartModule
  ],
  controllers: [OrderController, CartController],
  providers: [OrderService, CartService],
})
export class OrderModule { }
