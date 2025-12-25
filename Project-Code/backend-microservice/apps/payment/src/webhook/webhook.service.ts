import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET!, {
            apiVersion: '2025-12-15.clover'
        });
    }

    async stripeHook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                req.body,
                sig!,
                process.env.STRIPE_WEBHOOK_SECRET!,
            );
        } catch (err: any) {
            console.error('Webhook signature verification failed.', err.message);
            return res
                .status(HttpStatus.BAD_REQUEST)
                .send(`Webhook Error: ${err.message}`);
        }
        try {
            switch (event.type) {
                case 'invoice.paid':
                    console.log('Invoice paid:', event.data.object);
                    break;

                case 'customer.subscription.deleted':
                    console.log('Subscription deleted:', event.data.object);
                    break;

                case 'invoice.payment_action_required':
                case 'invoice.payment_failed':
                    console.log('Payment issue:', event.data.object);
                    break;

                default:
                    console.log(`Unhandled event type ${event.type} at ${(new Date()).toISOString()}`);
            }

            return res.json({ received: true, error: false });
        } catch (err) {
            console.error('Error handling webhook:', err);
            return res.status(500).json({ received: true, error: true });
        }
    }
}
