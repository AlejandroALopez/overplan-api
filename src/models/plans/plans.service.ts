import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name)
    private planModel: Model<PlanDocument>,

    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  async create(plan: Plan): Promise<Plan> {
    const createdPlan = new this.planModel(plan);

    // TODO:
    // 1. Call ChatGPT API with some parameters from plan (goal, numWeeks)
    // 2. Retrieve JSON array of tasks
    // 3. Loop through it, creating tasks (from plan, pass in: planId)
    // 4. Tasks were created (saved?), finish by saving plan

    // Note: Only save on success
    return createdPlan.save();
  }

  async findAll(): Promise<Plan[]> {
    return this.planModel.find({}).exec();
  }

  async findByUserId(userId: string): Promise<Plan[]> {
    return this.planModel.find({ userId: userId }).exec();
  }

  async findOne(id: string): Promise<Plan> {
    return this.planModel.findById(id).exec();
  }

  async update(id: string, plan: Plan): Promise<Plan> {
    return this.planModel.findByIdAndUpdate(id, plan, { new: true }).exec();
  }

  async remove(id: string): Promise<Plan> {
    // Delete all tasks associated with the plan
    await this.taskModel.deleteMany({ planId: id });

    return this.planModel.findByIdAndDelete(id).exec();
  }
}
