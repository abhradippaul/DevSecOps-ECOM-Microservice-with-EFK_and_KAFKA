import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const PORT = process.env.ORDER_SERVICE_PORT ?? 3001
  const app = await NestFactory.create(OrderModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
  console.log(`Order service connected on port ${PORT}`)
}
bootstrap();
