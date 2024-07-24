import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import Stripe from 'stripe';
import { SkipAuth } from '../auth/constants';

@Controller('webhooks')
export class WebhookController {
  private stripe: Stripe;

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
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionUpdate(subscription);
        break;
      case 'customer.subscription.deleted':
        const sub = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionDeleted(sub);
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await this.handleInvoicePaymentSucceeded(invoice);
        break;
      // Add more cases as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    res.json({ received: true });
  }

  // Triggered when user buys a subscription
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

  // Triggered when a subscription gets renewed
  @SkipAuth()
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string;
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    const customer = (await this.stripe.customers.retrieve(
      subscription.customer as string,
    )) as Stripe.Customer;
    const userEmail = customer.email;
    const user = await this.userService.findOneByEmail(userEmail);

    if (user) {
      const renewalDate = subscription.current_period_end; // new renewal date
      await this.userService.updateUserSubscription(
        user.id,
        user.tier,
        user.subscriptionId,
        renewalDate,
      );
    }
  }

  // Triggered when user cancels their subscription (or re-activates it)
  @SkipAuth()
  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const customer = (await this.stripe.customers.retrieve(
      subscription.customer as string,
    )) as Stripe.Customer;
    const userEmail = customer.email;
    const user = await this.userService.findOneByEmail(userEmail);

    if (user) {
      await this.userService.update(user.id, {
        subActive: !subscription.cancel_at_period_end,
      });
    }
  }

  // Triggers when a user subscription ends (no renewal)
  @SkipAuth()
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customer = (await this.stripe.customers.retrieve(
      subscription.customer as string,
    )) as Stripe.Customer;
    const userEmail = customer.email;
    const user = await this.userService.findOneByEmail(userEmail);

    if (user) {
      await this.userService.update(user.id, {
        tier: 'Free',
        subscriptionId: null,
        renewalDate: null,
        subActive: false,
      });
    }
  }
}
