import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MedalDocument = HydratedDocument<Medal>;

@Schema()
export class Medal {
  @Prop({ required: true })
  goal: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  imageKey: string;

  @Prop({ required: true })
  completionDate: string;

  @Prop({ required: true })
  planId: string;
}

export const MedalSchema = SchemaFactory.createForClass(Medal);
