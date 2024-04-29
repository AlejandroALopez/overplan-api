import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

const statusValues = ['backlog', 'active', 'in progress', 'completed'];

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true })
  week: number;

  @Prop({
    required: true,
    enum: statusValues,
  })
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
