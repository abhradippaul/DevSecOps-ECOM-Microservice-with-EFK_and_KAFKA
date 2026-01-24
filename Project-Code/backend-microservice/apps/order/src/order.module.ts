import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';
import { OrderProducerQueueService } from './rabbitmq/producer/order/order-producer.service';
import { CartConsumerService } from './rabbitmq/consumer/cart/cart-consumer.service';
import { CacheModule } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import { CacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';

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
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: Number(process.env.PRODUCT_SERVICE_PORT),
        },
      },
    ]),
    CartModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis(process.env.REDIS_URL),
          ],
        };
      },
    }),
  ],
  controllers: [OrderController, CartController],
  providers: [OrderService, CartService, OrderProducerQueueService, CartConsumerService],
})
export class OrderModule { }
