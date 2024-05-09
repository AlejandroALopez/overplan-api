import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

const statusValues = ['Backlog', 'Active', 'In Progress', 'Completed'];

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
    default: 'Backlog',
  })
  status: string;

  @Prop({ default: null })
  completionDate: string | null;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
