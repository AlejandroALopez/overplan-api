import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import Stripe from 'stripe';
import { SkipAuth } from '../auth/constants';

@Controller('webhooks')
export class WebhookController {
  private stripe: Stripe;
  private TOKENS_FOR_PRO: number = 10;

  constructor(private userService: UsersService) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  @SkipAuth()
  @Post()
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
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
      case 'customer.subscription.updated':
        const obj = event.data.object as Stripe.Event.Data.Object;
        await this.handleSubscriptionUpdate(obj);
        break;
      // Add more cases as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    res.json({ received: true });
  }

  // Triggered when user upgrades their account
  @SkipAuth()
  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const user = await this.userService.findOneById(
      session.client_reference_id,
    );

    if (user) {
      // Update user's subscription status or benefits
      const lineItems = await this.stripe.checkout.sessions.listLineItems(
        session.id,
      );
      const productId = lineItems.data[0].price.id;
      const subscriptionId = session.subscription as string;
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);

      const renewalDate = subscription.current_period_end; // timestamp

      let subscriptionType: string;
      switch (productId) {
        case process.env.NEXT_PUBLIC_STRIPE_PRO_MONTH_PRICE_ID:
          subscriptionType = 'Pro (month)';
          break;
        case process.env.NEXT_PUBLIC_STRIPE_PRO_YEAR_PRICE_ID:
          subscriptionType = 'Pro (year)';
          break;
        default:
          break;
      }

      if (subscriptionType) {
        await this.userService.updateUserSubscription(
          user.id,
          subscriptionType,
          subscriptionId,
          renewalDate,
        );
      }
    }
  }

  // Triggered when user cancels their subscription or re-activates it
  @SkipAuth()
  private async handleSubscriptionUpdate(obj: Stripe.Event.Data.Object) {
    const user = await this.userService.findOneBySubscriptionId(obj['id']);

    if (user && obj['cancel_at_period_end']) {
      await this.userService.cancelUserSubscription(user.id);
    }
  }
}
