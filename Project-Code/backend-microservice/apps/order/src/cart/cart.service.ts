import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartDocument } from './schema/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { AddItemToCartDto } from 'apps/common/dto/order/add-item-cart.dto';

@Injectable()
export class CartService {

    constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async createCart(userId: string) {
        const isCartCreated = await this.cartModel.create({ userId })
        if (!isCartCreated?._id) throw new BadRequestException("Failed to create cart")
        return {
            message: "Cart created successfully",
            data: isCartCreated
        }
    }

    async getAllCartItems(cartId: string) {
        const cacheKey = `cart:${cartId}`
        let cartDetails: CartDocument | undefined | null = await this.cacheManager.get(cacheKey)
        if (!cartDetails?._id) {
            cartDetails = await this.cartModel.findOne({ _id: cartId })
            if (!cartDetails?._id) throw new NotFoundException("Cart not found")
            await this.cacheManager.set(cacheKey, cartDetails, 60 * 1000)
        }
        console.log("Cart details fetched successfully")
        return {
            message: "Cart details fetched successfully",
            data: cartDetails || []
        }
    }

    async addToCart(body: AddItemToCartDto, cartId: string) {
        const cacheKey = `cart:${cartId}`
        let cartDetails: CartDocument | undefined | null = await this.cacheManager.get(cacheKey)

        if (!cartDetails?._id) {
            cartDetails = await this.cartModel.findOne({ _id: cartId })
            if (!cartDetails?._id) throw new NotFoundException("Cart not found")
        }

        let itemIndex = cartDetails.items.findIndex((item) => item.productId === body.productId)
        let newItemArray = itemIndex === -1 ? [body, ...cartDetails.items] : cartDetails.items.map((item) => item.productId === body.productId && item.price === body.price ? { ...item, quantity: item.quantity + body.quantity } : item)

        const totalPrice = newItemArray.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );

        const isCartUpdated = await this.cartModel.updateOne({ _id: cartId }, { $set: { items: newItemArray, totalPrice, totalItems: newItemArray.length } })

        if (!isCartUpdated.modifiedCount) throw new BadRequestException("Failed to add product to cart")
        await this.cacheManager.del(cacheKey)
        console.log("Product added to cart successfully")
        return {
            message: 'Product added to cart successfully',
            data: isCartUpdated
        };
    }
}
