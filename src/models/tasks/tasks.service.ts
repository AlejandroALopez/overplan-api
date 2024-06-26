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

  // Increase 'week' value by one of all incomplete tasks with matching planId
  async moveTasks(planId: string, week: number) {
    try {
      const tasks = await this.taskModel.find({ planId, week });

      for (const task of tasks) {
        if (task.status !== 'Completed') {
          task.week = week + 1;
          await task.save();
        }
      }

      return 'Tasks moved successfully.';
    } catch (error) {
      console.error('Error moving tasks:', error);
      throw new Error('Failed to move tasks.');
    }
  }
}
