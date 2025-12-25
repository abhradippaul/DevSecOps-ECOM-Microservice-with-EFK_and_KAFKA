import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PRODUCT_SERVICE_PORT ?? 3003
  const app = await NestFactory.create(ProductModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  await app.listen(PORT);
  console.log(`Product service connected on port ${PORT}`)
}
bootstrap();
