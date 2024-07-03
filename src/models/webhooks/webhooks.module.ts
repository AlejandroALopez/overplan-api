import { Module } from '@nestjs/common';
import { WebhookController } from './webhooks.controller';
import { UsersService } from '../users/users.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../users/user.entity';

@Module({
  //   imports: [TypeOrmModule.forFeature([User])],
  imports: [],
  controllers: [WebhookController],
  providers: [UsersService],
})
export class WebhookModule {}
