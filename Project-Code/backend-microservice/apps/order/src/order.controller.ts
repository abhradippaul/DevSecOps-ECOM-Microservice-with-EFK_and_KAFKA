import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get()
  getHello(): string {
    return this.orderService.getHello();
  }

  @Get('health')
  checkHealth() {
    return this.orderService.checkHealth();
  }

}
