import { Module } from '@nestjs/common';
import { SnsPublisherService } from './sns.publisher.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env.development"
        })
    ],
    providers: [SnsPublisherService],
    exports: [SnsPublisherService],
})
export class SnsModule { }