import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order-dto';

@Controller("api/v1/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('health')
  checkHealth() {
    return this.orderService.checkHealth();
  }

  @Post("create-order")
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto)
  }

  @Get("get-orders/:customerId")
  getOrdersByCustomerId(@Param("customerId") customerId: string) {
    return this.orderService.getOrdersByCustomerId(customerId)
  }

}
