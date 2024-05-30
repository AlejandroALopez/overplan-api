import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({})
export class SubscriptionModule {
  static forRootAsync(): DynamicModule {
    return {
      module: SubscriptionModule,
      controllers: [SubscriptionController],
      imports: [ConfigModule.forRoot()],
      providers: [
        SubscriptionService,
        {
          provide: 'STRIPE_API_KEY',
          useFactory: async (configService: ConfigService) =>
            configService.get('STRIPE_API_KEY'),
          inject: [ConfigService],
        },
      ],
    };
  }
}
