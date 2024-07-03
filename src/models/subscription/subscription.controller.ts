import { Controller, Get, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get('products')
  async getProducts() {
    return await this.subscriptionService.getProducts();
  }

  @Get('customers')
  async getCustomers() {
    return await this.subscriptionService.getCustomers();
  }

  @Post()
  async createSubscription(
    @Body() createSubscriptionDto: { email: string; priceId: string },
  ) {
    const { email, priceId } = createSubscriptionDto;
    const customer = await this.subscriptionService.createCustomer(email);
    return this.subscriptionService.createSubscription(customer.id, priceId);
  }

  @Post('checkout-session')
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: { userId: string, email: string, priceId: string },
  ) {
    const { userId, email, priceId } = createCheckoutSessionDto;
    const session =
      await this.subscriptionService.createCheckoutSession(userId, email, priceId);
    return { sessionId: session.id };
  }
}
