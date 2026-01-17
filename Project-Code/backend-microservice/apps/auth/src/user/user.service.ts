import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../schema/user.entity';
import { Repository } from 'typeorm';
import { createHashPassword, verifyPassword } from 'apps/common/auth/bcrypt';
import { JwtService } from '@nestjs/jwt';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

interface UserDetails {
    sub: string
    email: string
    iat: number,
    exp: number
}

@Injectable()
export class UserService {
    private channelWrapper: ChannelWrapper;

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>, private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        const connection = amqp.connect([process.env.RABBITMQ_URL!]);
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => {
                return channel.assertQueue('user_queue', { durable: true });
            },
        });
    }

    async createUser(body: CreateUserDto) {
        const isUserAlreadyExists = await this.userRepository.findOne({ where: { email: body.email } })

        if (isUserAlreadyExists?.id) throw new ConflictException("User already exists")

        const hashedPassword = await createHashPassword(body.password, 10)

        const isUserCreated = await this.userRepository.save({
            ...body,
            password: hashedPassword
        })

        if (!isUserCreated?.id) throw new BadRequestException("Failed to create user")

        await this.channelWrapper.sendToQueue(
            'user.created',
            Buffer.from(JSON.stringify({
                userId: isUserCreated.id
            })),
            {
                persistent: true,
            },
        );

        console.log("User created successfully")
        return {
            message: "User created successfully",
            data: isUserCreated
        }
    }

    async loginUser(body: LoginUserDto) {
        const isUserExists = await this.userRepository.findOne({ where: { email: body.email } })

        if (!isUserExists?.id) throw new NotFoundException("Email or password is wrong")

        const isPasswordValid = await verifyPassword(body.password, isUserExists.password)

        if (!isPasswordValid.valueOf()) throw new NotFoundException("Email or password is wrong")

        const payload = { sub: isUserExists.id, email: isUserExists.email };
        const access_token = await this.jwtService.signAsync(payload)

        console.log("User loggedin successfully")
        return {
            message: "User loggedin successfully",
            access_token
        }
    }

    async getUserDetails(userInfo: UserDetails | null | undefined) {
        if (!userInfo) {
            throw new UnauthorizedException("User is unauthorized");
        }

        const userId = String(userInfo.sub);
        const cacheKey = `user:${userId}`;

        let userDetails = await this.cacheManager.get<User | null>(cacheKey);

        if (!userDetails) {
            userDetails = await this.userRepository.findOneBy({ id: userId });

            if (!userDetails) {
                throw new UnauthorizedException("User is not found");
            }

            await this.cacheManager.set(cacheKey, userDetails, 3600);
            console.log("Cache Miss - Stored");
        } else {
            console.log("Cache Hit Successfully");
        }

        return {
            message: "Fetched user details successfully",
            data: userDetails,
        };
    }

    async verifyUser(userInfo: UserDetails | null | undefined) {

        if (!userInfo) throw new UnauthorizedException("User is unauthorized")

        console.log("Fetched user details successfully")

        return {
            message: "Fetched user details successfully",
            data: userInfo || {}
        }
    }
}
