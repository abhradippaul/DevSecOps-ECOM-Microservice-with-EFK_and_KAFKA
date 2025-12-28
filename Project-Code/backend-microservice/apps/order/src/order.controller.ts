import { Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller("api/v1/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('health')
  checkHealth() {
    return this.orderService.checkHealth();
  }

  @Post("create-order")
  createOrder() {
    return this.orderService.createOrder()
  }

}
