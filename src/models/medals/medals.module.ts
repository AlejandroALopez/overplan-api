import { Module } from '@nestjs/common';
import { MedalController } from './medals.controller';
import { MedalService } from './medals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Medal, MedalSchema } from './schemas/medal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Medal.name, schema: MedalSchema }]),
  ],
  controllers: [MedalController],
  providers: [MedalService],
})
export class MedalsModule {}
