import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.userModel.findOne({ id }).exec();
  }

  async updateUserSubscription(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
  }

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      activePlanId: null,
      tier: 'Free',
      tokens: 1,
    });
    return user.save();
  }

  async createSSOUser(
    email: string,
    firstName: string,
    lastName: string,
    provider: string,
  ): Promise<User> {
    const user = new this.userModel({
      email,
      firstName,
      lastName,
      provider,
      password: null, // SSO users might not have a password
      activePlanId: null,
      tier: 'Free',
      tokens: 1,
    });
    return user.save();
  }
}
