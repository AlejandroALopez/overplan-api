import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TaskModule } from './models/tasks/tasks.module';
import { PlanModule } from './models/plans/plans.module';
import { ChatGPTModule } from './models/chatgpt/chatgpt.module';
import { AuthModule } from './models/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './models/auth/jwt-auth.guard';
import { SubscriptionModule } from './models/subscription/subscription.module';
import { MedalsModule } from './models/medals/medals.module';

@Module({
  imports: [
    SubscriptionModule.forRootAsync(),
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URL,
      }),
    }),
    MedalsModule,
    TaskModule,
    PlanModule,
    ChatGPTModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
