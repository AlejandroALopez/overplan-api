import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true, default: '' })
  lastName: string;

  @Prop()
  provider: string; // e.g., 'google', 'github', etc.
}

export const UserSchema = SchemaFactory.createForClass(User);
