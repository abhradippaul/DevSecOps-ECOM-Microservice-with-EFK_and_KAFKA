import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { OrderCreatedDto } from 'apps/common/rabbitmq/dto/order-created-dto';

@Injectable()
export class RabbitMQProducerService {
    private channelWrapper: ChannelWrapper;

    constructor() {
        const connection = amqp.connect([process.env.RABBITMQ_URL!]);
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => {
                return channel.assertQueue('order.created', { durable: true });
            },
        });
    }
    async sendOrderCreateNotification(data: OrderCreatedDto) {
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