import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemToCartDto } from 'apps/common/dto/order/add-item-cart.dto';

@Controller('/api/v1/order/cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get("get-all-items/:cartId")
    getAllCartItems(@Param("cartId") cartId: string) {
        return this.cartService.getAllCartItems(cartId)
    }

    @Patch("add-to-cart/:cartId")
    addToCart(@Body() body: AddItemToCartDto, @Param("cartId") cartId: string) {
        return this.cartService.addToCart(body, cartId)
    }
}
