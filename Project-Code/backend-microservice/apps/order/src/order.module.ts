import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
<<<<<<< Updated upstream
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
=======
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
>>>>>>> Stashed changes

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.development"
    }),
    MongooseModule.forRoot(process.env.ORDER_SERVICE_MONGODB_URL!),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
<<<<<<< Updated upstream
    CartModule
=======
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
    RabbitMQModule
>>>>>>> Stashed changes
  ],
  controllers: [OrderController, CartController],
  providers: [OrderService, CartService],
})
export class OrderModule { }
