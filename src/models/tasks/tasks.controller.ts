import {
  Controller,
  Param,
  Query,
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

  // GET /tasks - Retrieve all tasks filtered by planId and week if provided
  @Get()
  async findAll(
    @Query('planId') planId?: string,
    @Query('week') week?: number,
  ): Promise<TaskModel[]> {
    if (planId && week) {
      return await this.taskService.findByPlanIdAndWeek(planId, week);
    } else if (planId) {
      return await this.taskService.findByPlanId(planId);
    } else {
      return await this.taskService.findAll();
    }
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
