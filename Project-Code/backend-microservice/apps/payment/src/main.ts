import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PAYMENT_SERVICE_PORT ?? 3002
  const app = await NestFactory.create(PaymentModule);
  app.use(
    '/api/v1/payment/webhook/stripe',
    bodyParser.raw({ type: 'application/json' }),
  );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(PORT);
  console.log(`Payment service connected on port ${PORT}`)
}
bootstrap();
