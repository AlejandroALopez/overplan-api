import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BadgeDocument = HydratedDocument<Badge>;

@Schema()
export class Badge {
  @Prop({ required: true })
  goal: string;

  @Prop({ required: true })
  weeks: number;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true })
  imageKey: string;

  @Prop({ required: true })
  completionDate: string;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
