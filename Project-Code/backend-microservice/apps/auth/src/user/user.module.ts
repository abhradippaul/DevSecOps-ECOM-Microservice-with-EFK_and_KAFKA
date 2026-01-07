import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClerkClientProvider } from '../providers/clerk.provider';

@Module({

    controllers: [UserController],
    providers: [UserService, ClerkClientProvider]
})
export class UserModule { }
