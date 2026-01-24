import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../schema/user.entity';
import { Repository } from 'typeorm';
import { createHashPassword, createHashRefreshToken, verifyHashRefreshToken, verifyPassword } from 'apps/common/auth/bcrypt';
import { JwtService } from '@nestjs/jwt';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CartCreatedQueue } from './user-consumer.service';
import { UserDetails } from 'apps/common/types/auth/user-details';
import { CreateUserDto } from 'apps/common/dto/auth/dto/create-user-dto';
import { LoginUserDto } from 'apps/common/dto/auth/dto/login-user-dto';
import { LogoutUserDto } from 'apps/common/dto/auth/dto/logout-user.dto';

@Injectable()
export class UserService {
    private channelWrapper: ChannelWrapper;

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        const connection = amqp.connect([process.env.RABBITMQ_URL!]);
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => {
                return channel.assertQueue('user.created', { durable: true });
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
        const isUserExists = await this.userRepository.findOne({ where: { email: body.email }, select: ['id', 'password', 'roles'] })

        if (!isUserExists?.id) throw new NotFoundException("Email or password is wrong")

        const isPasswordValid = await verifyPassword(body.password, isUserExists.password)

        if (!isPasswordValid.valueOf()) throw new NotFoundException("Email or password is wrong")

        const payload = { sub: isUserExists.id, roles: isUserExists.roles };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: "15m",
                secret: process.env.JWT_ACCESS_SECRET
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: "7d",
                secret: process.env.JWT_REFRESH_SECRET
            }),
        ]);

        const hash = await createHashRefreshToken(refreshToken, 12)

        const isTokenSaved = await this.userRepository.update({ id: isUserExists.id }, { refreshToken: hash })

        if (!isTokenSaved.affected) throw new BadRequestException("Failed to updated refresh token")

        console.log("User loggedin successfully")
        return {
            message: "User loggedin successfully",
            accessToken,
            refreshToken
        }
    }

    async logoutUser(body: LogoutUserDto) {
        const isUserExists = await this.userRepository.findOne({ where: { email: body.id, roles: body.role }, select: ['id', 'roles'] })

        if (!isUserExists?.id) throw new NotFoundException("Email or password is wrong")

        const isLogoutSuccessful = await this.userRepository.update({ id: isUserExists.id }, { refreshToken: null })

        if (!isLogoutSuccessful.affected) throw new BadRequestException("Failed to logout")
        console.log("Logged out successfully")

        return {
            message: "Logged out successfully"
        }
    }

    async handleRefreshToken(token: string) {

        if (!token) throw new UnauthorizedException("User is unauthorized");

        let data: UserDetails = await this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET })

        if (!data?.sub) throw new UnauthorizedException("Unauthorized")

        const userDetails = await this.userRepository.findOne({ where: { id: data.sub, roles: data.role }, select: ["id", "refreshToken"] })

        if (!userDetails?.id || !userDetails?.refreshToken) throw new UnauthorizedException("User is unauthorized");

        const isValid = await verifyHashRefreshToken(token, userDetails.refreshToken)

        if (!isValid) {
            await this.userRepository.update({ id: userDetails.id }, { refreshToken: null })
            throw new UnauthorizedException("Unauthorized")
        }

        const payload = { sub: userDetails.id, roles: userDetails.roles };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: "15m",
                secret: process.env.JWT_ACCESS_SECRET
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: "7d",
                secret: process.env.JWT_REFRESH_SECRET
            }),
        ]);

        const hash = await createHashRefreshToken(refreshToken, 12)

        const isTokenSaved = await this.userRepository.update({ id: userDetails.id }, { refreshToken: hash })

        if (!isTokenSaved.affected) throw new BadRequestException("Failed to updated refresh token")

        return {
            accessToken,
            refreshToken
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
            userDetails = await this.userRepository.findOne({ where: { id: userId }, select: ['id', 'email', 'cartId', 'firstName', 'middleName', 'lastName'] })

            if (!userDetails) {
                throw new UnauthorizedException("User is not found");
            }

            await this.cacheManager.set(cacheKey, userDetails, 60 * 1000);
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

    async addCartIdToUser(cartCreatedQueue: CartCreatedQueue) {
        if (!cartCreatedQueue.cartId || !cartCreatedQueue.userId) throw new BadRequestException("Cart created request is not valid")

        const isUserUpdated = await this.userRepository.update({ id: cartCreatedQueue.userId }, { cartId: cartCreatedQueue.cartId, isActive: true, isVerified: true })

        if (!isUserUpdated.affected) throw new BadRequestException("Failed to upddate user for cart")
        return {
            message: "User updated successfully for cart",
            data: isUserUpdated
        }
    }
}
