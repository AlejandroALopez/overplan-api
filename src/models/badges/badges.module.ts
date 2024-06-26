import { Module } from '@nestjs/common';
import { BadgeController } from './badges.controller';
import { BadgeService } from './badges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Badge, BadgeSchema } from './schemas/badge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Badge.name, schema: BadgeSchema }]),
  ],
  controllers: [BadgeController],
  providers: [BadgeService],
})
export class BadgesModule {}
