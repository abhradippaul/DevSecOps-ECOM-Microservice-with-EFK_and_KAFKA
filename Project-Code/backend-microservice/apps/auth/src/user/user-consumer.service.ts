import { BadGatewayException, Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { UserService } from './user.service';

export interface CartCreatedQueue {
    userId: string
    cartId: string
}

@Injectable()
export class ConsumerService implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper;

    constructor(private readonly userService: UserService) {
        const connection = amqp.connect([process.env.RABBITMQ_URL!]);
        this.channelWrapper = connection.createChannel();
    }

    public async onModuleInit() {
        try {
            console.log("RabbitMQ Consumer running")
            await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
                await channel.assertQueue('cart.created', { durable: true });
                await channel.consume('cart.created', async (message) => {
                    if (message) {
                        const content: CartCreatedQueue = JSON.parse(message.content.toString())
                        console.log('Received user consumer message:', content);
                        await this.userService.addCartIdToUser(content)
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