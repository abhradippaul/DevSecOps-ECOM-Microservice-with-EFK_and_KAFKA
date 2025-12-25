import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const PORT = process.env.AUTH_SERVICE_PORT ?? 3000
  const app = await NestFactory.create(AuthModule);
  await app.listen(PORT);
  console.log(`Auth service connected on port ${PORT}`)
}
bootstrap();
