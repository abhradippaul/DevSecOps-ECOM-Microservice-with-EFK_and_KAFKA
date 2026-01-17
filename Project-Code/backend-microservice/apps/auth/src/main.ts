import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const PORT = process.env.AUTH_SERVICE_PORT ?? 3000
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );

  await app.listen(PORT);

  console.log(`Auth service connected on port ${PORT}`)
}
bootstrap();
