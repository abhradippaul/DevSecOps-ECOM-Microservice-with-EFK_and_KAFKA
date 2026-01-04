import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session-dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET!, {
      apiVersion: '2025-12-15.clover'
    });
  }

  checkHealth() {
    return {
      message: 'Payment Server is healthy',
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }

  async createCheckoutSession(
    createCheckoutSessionDto: CreateCheckoutSessionDto
  ): Promise<Stripe.Checkout.Session> {
    try {

      const items = createCheckoutSessionDto.items.map(({ amount, productId, quantity }) => ({
        price_data: {
          currency: createCheckoutSessionDto.currency,
          product_data: {
            name: productId,
          },
          unit_amount: amount * 100,
        },
        quantity: quantity,
      }))

      const session = await this.stripe.checkout.sessions.create({
        line_items: items,
        mode: 'payment',
        success_url: `http://localhost:8002/success.html`,
        cancel_url: `http://localhost:8002/cancel.html`,
        // metadata: {
        //   productId: productId,
        // },
      });

      return session;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new InternalServerErrorException(
        'Failed to create checkout session',
      );
    }
  }

}