import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cart } from './schema/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class CartService {
    private channelWrapper: ChannelWrapper;
    private readonly logger = new Logger(CartService.name)

    constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {
        const connection = amqp.connect([process.env.RABBITMQ_URL!]);
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => {
                return channel.assertQueue('cart_queue', { durable: true });
            },
        });
    }

    async createCart(userId: string) {
        if (!userId) throw new BadRequestException("UserId not found in Cart creation")

        const isCartCreated = await this.cartModel.create({
            userId
        })
        if (!isCartCreated?._id) throw new BadRequestException("Failed to create cart")

        await this.channelWrapper.sendToQueue(
            'cart.created',
            Buffer.from(JSON.stringify({
                userId: isCartCreated._id
            })),
            {
                persistent: true,
            },
        );

        return {
            message: "Cart created successfully",
            data: isCartCreated
        }
    }

    async getAllCartItems(customerId: string) {
        if (!customerId) throw new BadRequestException("Customer Id not found")
        const cartItems = await this.cartModel.findOne({ customerId })
        console.log("Fetched cart item")
        return {
            message: "Cart item fetched successfully",
            data: cartItems || []
        }
    }

    async addToCart() {
        // const isCartAdded = await this.cartModel.create()
        console.log("Added to cart")
        return {
            message: 'Product added to cart successfully',
        };
    }
}
