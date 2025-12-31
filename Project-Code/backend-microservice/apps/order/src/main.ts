import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.ORDER_SERVICE_PORT ?? 3001
  const app = await NestFactory.create(OrderModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(PORT);
  console.log(`Order service connected on port ${PORT}`)
}
bootstrap();
