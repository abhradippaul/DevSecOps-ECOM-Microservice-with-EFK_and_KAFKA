import { Module } from '@nestjs/common'
import { RabbitMQConsumerService } from "./rabbitmq-manager.service"

@Module({
    imports: [],
    providers: [RabbitMQConsumerService],
    exports: [RabbitMQConsumerService],
})
export class RabbitMQModule { }