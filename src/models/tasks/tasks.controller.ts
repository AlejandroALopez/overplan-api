import {
  Controller,
  Param,
  Get,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { Task as TaskModel } from './schemas/task.schema';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() task: TaskModel): Promise<TaskModel> {
    return this.taskService.create(task);
  }

  @Get()
  async findAll(): Promise<TaskModel[]> {
    return (await this.taskService.findAll()).reverse();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() task: TaskModel): Promise<TaskModel> {
    return this.taskService.update(id, task);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.remove(id);
  }
}
