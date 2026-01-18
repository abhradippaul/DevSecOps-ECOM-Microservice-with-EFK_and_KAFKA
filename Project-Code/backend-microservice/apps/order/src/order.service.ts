import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order-dto';
import { UpdateOrderStatusDto } from './dto/update-order-status-dto';
import { OrderProducerQueueService } from './rabbitmq/producer/order/order-producer.service';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>, private readonly orderProducerQueueService: OrderProducerQueueService) { }

  checkHealth() {
    return {
      message: 'Order Server is healthy',
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }

  async getOrdersByOrderId(orderId: string) {
    const order = await this.orderModel.findById(orderId)
    if (!order?._id) throw new NotFoundException("Order not found")

    console.log("Order fetched successfully")
    return {
      message: 'Order fetched successsfully',
      data: order
    };
  }

  async getOrdersByCustomerId(customerId: string) {
    const orders = await this.orderModel
      .find({ customerId })
      .sort({ createdAt: -1 });

    console.log("User orders fetched successfully")
    return {
      message: 'Order fetched successsfully',
      data: orders || []
    };
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const totalAmount = createOrderDto.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const isOrderCreated = await this.orderModel.create({
        ...createOrderDto,
        totalAmount,
      });

      this.orderProducerQueueService.sendOrderCreateNotification({ currency: "USD", items: createOrderDto.items, customerId: createOrderDto.customerId })

      if (!isOrderCreated._id) throw new BadRequestException("Failed to create order")

      console.log("Order creatd successfully")
      return {
        message: 'Order created successsfully',
        data: isOrderCreated
      };

    } catch (err) {
      console.log(err)
      return {
        message: 'Internal server error',
        err
      };
    }
  }

  async updateOrderStatus(orderId: string, body: UpdateOrderStatusDto) {
    try {
      if (!body?.status) throw new ForbiddenException("Required all fields")

      const isOrderCancelled = await this.orderModel.updateOne({ _id: orderId }, { $set: { status: body?.status } })
      if (!isOrderCancelled.modifiedCount) throw new BadRequestException("Failed to cancel order")

      console.log("Order status updated successfully")
      return {
        message: 'Order status updated successsfully',
        data: isOrderCancelled
      };

    } catch (err) {
      console.log(err)
      return {
        message: 'Internal server error',
        err
      };
    }
  }
}
