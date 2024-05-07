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
import { PlanService } from './plans.service';

import { Plan as PlanModel } from './schemas/plan.schema';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() plan: CreatePlanDto): Promise<PlanModel> {
    return this.planService.createWithGeneratedTasks(plan);
  }

  // GET /plans - Retrieve all plans filtered by userId
  @Get()
  async findAll(@Query('userId') userId?: string): Promise<PlanModel[]> {
    if (userId) {
      return (await this.planService.findByUserId(userId)).reverse();
    } else {
      return (await this.planService.findAll()).reverse();
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PlanModel> {
    return this.planService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() plan: PlanModel): Promise<PlanModel> {
    return this.planService.update(id, plan);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PlanModel> {
    return this.planService.remove(id);
  }
}
