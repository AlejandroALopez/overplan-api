import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Badge, BadgeDocument } from './schemas/badge.schema';
import { CreateBadgeDto } from './dto/create-badge.dto';

@Injectable()
export class BadgeService {
  constructor(
    @InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
  ) {}

  async create(badge: CreateBadgeDto): Promise<Badge> {
    const createdBadge = new this.badgeModel(badge);
    return createdBadge.save();
  }

  async findAll(): Promise<Badge[]> {
    return this.badgeModel.find({}).exec();
  }

  async findOne(id: string): Promise<Badge> {
    return this.badgeModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<Badge[]> {
    return this.badgeModel.find({ userId: userId }).exec();
  }

  async update(id: string, badge: Badge): Promise<Badge> {
    return this.badgeModel.findByIdAndUpdate(id, badge, { new: true }).exec();
  }

  async remove(id: string): Promise<Badge> {
    return this.badgeModel.findByIdAndDelete(id).exec();
  }
}
