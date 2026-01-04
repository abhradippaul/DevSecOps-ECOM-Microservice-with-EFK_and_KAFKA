import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { RabbitMQModule } from './rabbitmq/consumer/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.development"
    }),
    WebhookModule,
    RabbitMQModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
