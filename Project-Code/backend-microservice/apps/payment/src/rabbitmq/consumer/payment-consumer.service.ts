import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { PaymentService } from '../../payment.service';

export interface CartCreatedQueue {
    userId: string
    cartId: string
}

@Injectable()
export class PaymentConsumerService implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper;

    constructor(private readonly paymentService: PaymentService) {
        const connection = amqp.connect([process.env.RABBITMQ_URL!]);
        this.channelWrapper = connection.createChannel();
    }

    public async onModuleInit() {
        try {
            console.log("RabbitMQ Consumer running for payment")
            await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
                await channel.assertQueue('order.created', { durable: true });
                await channel.consume('order.created', async (message) => {
                    if (message) {
                        const content: CartCreatedQueue = JSON.parse(message.content.toString())
                        console.log('Received payment consumer message:', content);
                        // await this.userService.addCartIdToUser(content)
                        channel.ack(message);
                    }
                });
            });
            console.log('Consumer service started and listening for messages.');
        } catch (err) {
            console.log('Error starting the consumer:', err);
        }
    }
}