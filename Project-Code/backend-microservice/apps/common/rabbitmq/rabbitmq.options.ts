import { Transport, RmqOptions } from '@nestjs/microservices';

export const rabbitMQUserConfig = (queue: string): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
        urls: [process.env.RABBITMQ_URL!],
        queue,
        queueOptions: {
            durable: true,
        },
    },
});