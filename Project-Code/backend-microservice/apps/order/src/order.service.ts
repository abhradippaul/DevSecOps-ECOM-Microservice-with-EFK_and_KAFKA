import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {

  checkHealth() {
    return {
      message: 'Order Server is healthy',
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }

  async createOrder() {
    console.log("Order creatd successfully")
    return {
      message: 'Order created successsfully',
    };
  }
}
