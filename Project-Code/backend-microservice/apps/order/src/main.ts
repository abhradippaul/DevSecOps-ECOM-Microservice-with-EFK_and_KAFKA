import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';

async function bootstrap() {
  const PORT = process.env.ORDER_SERVICE_PORT ?? 3001
  const app = await NestFactory.create(OrderModule);
  await app.listen(PORT);
  console.log(`Order service connected on port ${PORT}`)
}
bootstrap();
