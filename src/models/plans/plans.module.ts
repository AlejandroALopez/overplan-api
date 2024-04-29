import { Module } from '@nestjs/common';
import { PlanController } from './plans.controller';
import { PlanService } from './plans.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './schemas/plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
