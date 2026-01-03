import { BadRequestException, Injectable } from '@nestjs/common';
import { Cart } from './schema/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) { }

    async getAllCartItems(customerId: string) {
        if (!customerId) throw new BadRequestException("Customer Id not found")
        const cartItems = await this.cartModel.findOne({ customerId })
        console.log("Fetched cart item")
        return {
            message: "Cart item fetched successfully",
            data: cartItems || []
        }
    }

    addToCart() {
        console.log("Added to cart")
        return {
            message: 'Product added to cart successfully',
        };
    }
}
