import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import Stripe from 'stripe';

@Controller('webhooks')
export class WebhookController {
  private stripe: Stripe;
  private TOKENS_FOR_PRO: number = 10;

  constructor(private readonly userService: UsersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  @Post('stripe')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutSessionCompleted(session);
        break;
      // Add more cases as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    // Find user by session.client_reference_id
    const userEmail = session.client_reference_id;
    const user = await this.userService.findOneByEmail(userEmail);
    
    if (user) {
      // Update user's subscription status or benefits
      await this.userService.updateUserSubscription(user.id, {
        tokens: (user.tokens || 0) + this.TOKENS_FOR_PRO,
        tier: 'Pro',
      });
    }
  }
}
