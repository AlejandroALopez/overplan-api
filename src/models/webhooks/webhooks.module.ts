import { Module } from '@nestjs/common';
import { WebhookController } from './webhooks.controller';
import { UsersModule } from '../users/users.module';
import { UserSchema } from '../users/schemas/user.schema';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';

@Module({
  //   imports: [TypeOrmModule.forFeature([User])],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [WebhookController],
  // providers: [UsersService],
})
export class WebhookModule {}
