import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { ITask } from '../chatgpt/chatgpt.interfaces';
import { IPlanRequest, IPlanResponse } from '../chatgpt/chatgpt.interfaces';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { CreatePlanDto } from './dto/create-plan.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name)
    private planModel: Model<PlanDocument>,

    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async createWithGeneratedTasks(
    plan: CreatePlanDto,
    authToken: string,
  ): Promise<Plan> {
    // If user is out of tokens, throw error
    const user = await this.userModel.findById(plan.userId).exec();
    if (!user) {
      throw new Error('User not found');
    } else if (user.tokens < 1) {
      throw new Error('Not enough tokens to create a plan');
    }

    const createdPlan = new this.planModel(plan);
    const URL = this.configService.get('URL') + '/planai/create';

    // Call ChatGPT API with some parameters from plan (goal, numWeeks)
    const request: IPlanRequest = { goal: plan.goal, numWeeks: plan.numWeeks };
    const response: AxiosResponse<IPlanResponse> = await lastValueFrom(
      this.httpService.post<IPlanResponse>(URL, request, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
    );

    // Retrieve JSON array of tasks
    const tasks: ITask[] = response.data.result;

    // Loop through it, creating tasks (from plan, pass in: planId)
    const createdTasks = await Promise.all(
      tasks.map(async (taskData) => {
        const task = new this.taskModel({
          title: taskData.title,
          description: taskData.description,
          week: taskData.week,
          planId: createdPlan._id, // Assuming plan._id exists
        });
        return task.save();
      }),
    );

    // Check if all tasks were successfully created
    const allTasksCreated = createdTasks.every((task) => !!task);

    if (allTasksCreated) {
      // All tasks were created successfully, spend user token and save plan
      await this.userModel
        .findByIdAndUpdate(
          plan.userId,
          { tokens: user.tokens - 1 },
          { new: true },
        )
        .exec();
      return createdPlan.save();
    } else {
      // Rollback: Delete created tasks if any creation fails
      await Promise.all(
        createdTasks.map(async (task) => {
          if (task) {
            await this.taskModel.findByIdAndDelete(task._id).exec();
          }
        }),
      );
      throw new Error('Failed to create all tasks for the plan');
    }
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
