import { Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { WebhookService } from './webhook.service';

@Controller('api/v1/payment/webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) { }

    @Post("stripe")
    stripeHook(@Req() req: Request, @Res() res: Response) {
        return this.webhookService.stripeHook(req, res)
    }
}
