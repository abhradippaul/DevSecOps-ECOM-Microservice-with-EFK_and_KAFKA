import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { OrderCreatedQueueDto } from 'apps/common/rabbitmq/dto/order/order-created-queue.dto';

@Injectable()
export class OrderProducerQueueService {
    private channelWrapper: ChannelWrapper;

    constructor() {
        const connection = amqp.connect([process.env.RABBITMQ_URL!]);
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => {
                return channel.assertQueue('order.created', { durable: true });
            },
        });
    }
    async sendOrderCreateNotification(data: OrderCreatedQueueDto) {
        try {
            await this.channelWrapper.sendToQueue(
                'order.created',
                Buffer.from(JSON.stringify(data)),
                {
                    persistent: true,
                },
            );
            return { msg: 'Order created successfully' };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Error adding order to queue',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}