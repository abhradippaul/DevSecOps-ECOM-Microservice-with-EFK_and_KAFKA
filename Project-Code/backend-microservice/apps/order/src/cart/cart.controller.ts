import { Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('/api/v1/order/cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get("get-all-items/:customerId")
    getAllCartItems(@Param("customerId") customerId: string) {
        return this.cartService.getAllCartItems(customerId)
    }
}
