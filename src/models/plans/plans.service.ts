import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';

@Injectable()
export class PlanService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}

  async create(plan: Plan): Promise<Plan> {
    const createdPlan = new this.planModel(plan);
    return createdPlan.save();
  }

  async findAll(): Promise<Plan[]> {
    return this.planModel.find({}).exec();
  }

  async findOne(id: string): Promise<Plan> {
    return this.planModel.findById(id).exec();
  }

  async update(id: string, plan: Plan): Promise<Plan> {
    return this.planModel.findByIdAndUpdate(id, plan, { new: true }).exec();
  }

  async remove(id: string): Promise<Plan> {
    return this.planModel.findByIdAndDelete(id).exec();
  }
}
