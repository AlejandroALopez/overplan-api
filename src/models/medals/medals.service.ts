import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Medal, MedalDocument } from './schemas/medal.schema';
import { CreateMedalDto } from './dto/create-medal.dto';

@Injectable()
export class MedalService {
  constructor(
    @InjectModel(Medal.name) private medalModel: Model<MedalDocument>,
  ) {}

  async create(medal: CreateMedalDto): Promise<Medal> {
    const createdMedal = new this.medalModel(medal);
    return createdMedal.save();
  }

  async findAll(): Promise<Medal[]> {
    return this.medalModel.find({}).exec();
  }

  async findOne(id: string): Promise<Medal> {
    return this.medalModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<Medal[]> {
    return this.medalModel.find({ userId: userId }).exec();
  }

  async update(id: string, medal: Medal): Promise<Medal> {
    return this.medalModel.findByIdAndUpdate(id, medal, { new: true }).exec();
  }

  async remove(id: string): Promise<Medal> {
    return this.medalModel.findByIdAndDelete(id).exec();
  }
}
