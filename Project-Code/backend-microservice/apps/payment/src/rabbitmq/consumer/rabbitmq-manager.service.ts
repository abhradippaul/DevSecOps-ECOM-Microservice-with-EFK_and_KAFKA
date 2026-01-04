import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { OrderCreatedDto } from 'apps/common/rabbitmq/dto/order-created-dto';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit {
    private channelWrapper: ChannelWrapper;
    constructor() {
        const connection = amqp.connect([process.env.RABBITMQ_URL!]);
        this.channelWrapper = connection.createChannel();
    }

    public async onModuleInit() {
        try {
            await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
                await channel.consume('order.created', async (message) => {
                    if (message) {
                        const content = JSON.parse(
                            message.content.toString(),
                        ) as OrderCreatedDto;
                        console.log(content)
                    }
                });

            });
            console.log('Consumer service started and listening for messages.');
        } catch (err) {
            console.error('Error starting the consumer:', err);
        }
    }
}