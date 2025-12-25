import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session-dto';

@Controller("api/v1/payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get("health")
  checkHealth() {
    return this.paymentService.checkHealth()
  }

  @Post('create-checkout-session')
  createCheckoutSession(
    @Body() body: CreateCheckoutSessionDto
  ) {
    return this.paymentService.createCheckoutSession(body);
  }

}
