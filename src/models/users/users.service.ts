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
    return this.userModel.findById(id).exec();
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async updateUserSubscription(
    userId: string,
    subscriptionType: string,
    subscriptionId: string,
    renewalDate: number,
  ): Promise<User> {
    let tokens: number;

    switch (subscriptionType) {
      case 'Pro':
        tokens = 10; // New sub, assign tokens
        break;
      default:
        break; // keep tokens when switching back to Free tier
    }

    if (tokens) {
      // any paid tier, update tier and tokens
      return this.userModel
        .findByIdAndUpdate(
          userId,
          { tier: subscriptionType, tokens, subscriptionId, renewalDate},
          { new: true },
        )
        .exec();
    } else {
      // free tier, only update tier
      return this.userModel
        .findByIdAndUpdate(userId, { tier: subscriptionType }, { new: true })
        .exec();
    }
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
