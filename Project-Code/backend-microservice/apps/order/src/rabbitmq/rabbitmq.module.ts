import { Module } from '@nestjs/common'
import { RabbitMQProducerService } from './rabbitmq-manager.service'

@Module({
    imports: [],
    providers: [RabbitMQProducerService],
    exports: [RabbitMQProducerService],
})
export class RabbitMQModule { }