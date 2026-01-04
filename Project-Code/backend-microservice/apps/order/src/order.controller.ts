import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { UpdateOrderStatusDto } from './dto/update-order-status-dto';

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

  @Get("get-order/:orderId")
  getOrdersByOrderId(@Param("orderId") orderId: string) {
    return this.orderService.getOrdersByOrderId(orderId)
  }

  @Get("get-orders/:customerId")
  getOrdersByCustomerId(@Param("customerId") customerId: string) {
    return this.orderService.getOrdersByCustomerId(customerId)
  }

  @Patch("update-order-status/:orderId")
  updateOrderStatus(@Param("orderId") orderId: string, @Body() body: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(orderId, body)
  }

}
