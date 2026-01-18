import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionQueueDto } from 'apps/common/rabbitmq/dto/payment/create-checkout-session-queue.dto';

@Controller("api/v1/payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get("health")
  checkHealth() {
    return this.paymentService.checkHealth()
  }

  @Post('create-checkout-session')
  createCheckoutSession(
    @Body() body: CreateCheckoutSessionQueueDto
  ) {
    return this.paymentService.createCheckoutSession(body);
  }

}
