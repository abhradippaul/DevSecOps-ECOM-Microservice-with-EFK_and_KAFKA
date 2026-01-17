import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { CartService } from './cart.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper;

    constructor(private readonly cartService: CartService) {
        const connection = amqp.connect([process.env.RABBITMQ_URL!]);
        this.channelWrapper = connection.createChannel();
    }

    public async onModuleInit() {
        try {
            console.log("RabbitMQ Consumer running")
            await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
                await channel.assertQueue('user.created', { durable: true });
                await channel.consume('user.created', async (message) => {
                    if (message) {
                        const content = JSON.parse(message.content.toString()) as {
                            userId: string
                        };
                        console.log('Received message:', content);
                        await this.cartService.createCart(content.userId)
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