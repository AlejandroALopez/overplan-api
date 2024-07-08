import { Module } from '@nestjs/common';
import { WebhookController } from './webhooks.controller';
import { UsersModule } from '../users/users.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../users/user.entity';

@Module({
  //   imports: [TypeOrmModule.forFeature([User])],
  imports: [UsersModule],
  controllers: [WebhookController],
  // providers: [UsersService],
})
export class WebhookModule {}
