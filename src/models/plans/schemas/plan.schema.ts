import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlanDocument = HydratedDocument<Plan>;

@Schema()
export class Plan {
  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  goal: string;

  @Prop({ required: true })
  numWeeks: number;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true, default: false })
  completed: boolean;

  @Prop({ required: true, default: 1 })
  currWeek: number;

  @Prop({ required: true, default: 0 })
  weekProg: number;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  weekEndDate: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
