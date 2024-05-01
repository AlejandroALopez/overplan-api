import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TaskModule } from './models/tasks/tasks.module';
import { PlanModule } from './models/plans/plans.module';
import { ChatGPTModule } from './models/chatgpt/chatgpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URL,
      }),
    }),
    TaskModule,
    PlanModule,
    ChatGPTModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
