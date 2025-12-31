import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order-dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }

  checkHealth() {
    return {
      message: 'Order Server is healthy',
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }

  async getOrdersByCustomerId(customerId: string) {
    const orders = await this.orderModel.find({ customerId })

    console.log("Order fetched successfully")
    return {
      message: 'Order fetched successsfully',
      data: orders || []
    };
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const isOrderCreated = await this.orderModel.create(createOrderDto)
    if (!isOrderCreated._id) throw new BadRequestException("Failed to create order")

    console.log("Order creatd successfully")
    return {
      message: 'Order created successsfully',
      data: isOrderCreated
    };
  }
}
