import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../schema/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env.development"
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '3600s' },
        }),
        CacheModule.registerAsync({
            useFactory: async () => {
                return {
                    stores: [
                        new Keyv({
                            store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                        }),
                        new KeyvRedis('redis://localhost:6379'),
                    ],
                };
            },
        }),
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }
