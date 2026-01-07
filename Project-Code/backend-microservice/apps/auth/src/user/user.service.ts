import { ConflictException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { ClerkClient } from '@clerk/backend';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('ClerkClient')
        private readonly clerkClient: ClerkClient,
    ) { }

    async createUser(body: CreateUserDto) {
        try {
            const isUserCreated = await this.clerkClient.users.createUser({
                emailAddress: [body.email.toLowerCase()],
                password: body.password,
            });

            if (!isUserCreated?.id) throw new InternalServerErrorException("Failed to create user")

            console.log("User created successfully")
            return {
                message: "User created successfully",
                data: isUserCreated
            }
        } catch (err) {
            console.log(err)
            if (err?.errors?.[0]?.code === 'form_identifier_exists') {
                throw new ConflictException('User already exists');
            }
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async loginUser(body: LoginUserDto) {
        const token = await this.clerkClient.signInTokens.createSignInToken({
            userId: body.userId,
            expiresInSeconds: 3600
        })
        console.log(token)
        console.log("User loggedin successfully")
        return {
            message: "User loggedin successfully"
        }
    }
}
