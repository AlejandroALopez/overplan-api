import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(task: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(task);
    return createdTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find({}).exec();
  }

  async findOne(id: string): Promise<Task> {
    return this.taskModel.findById(id).exec();
  }

  async findByPlanIdAndWeek(planId: string, week: number): Promise<Task[]> {
    return this.taskModel.find({ planId: planId, week: week }).exec();
  }

  async findByPlanId(planId: string): Promise<Task[]> {
    return this.taskModel.find({ planId: planId }).exec();
  }

  async update(id: string, task: Task): Promise<Task> {
    return this.taskModel.findByIdAndUpdate(id, task, { new: true }).exec();
  }

  async remove(id: string): Promise<Task> {
    return this.taskModel.findByIdAndDelete(id).exec();
  }

  async moveTasks(planId: string, week: number) {
    // GET all tasks of plan and week
    // Iterate over each task
    // If status !== Completed, week + 1
    console.log(planId, week);
  }
}

//   async moveTasks(planId: string, week: number) {
//     // GET all tasks of plan and week
//     const tasks = await this.findByPlanIdAndWeek(planId, week);

//     // Iterate over each task
//     // If status !== Completed, week + 1

//     tasks.map((task) => {
//       console.log(task);
//     });

//     return null;
//   }
