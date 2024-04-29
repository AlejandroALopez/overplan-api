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
  currWeek: number;

  @Prop({ required: true })
  weekProg: number;

  @Prop({ required: true })
  weekEndDate: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
