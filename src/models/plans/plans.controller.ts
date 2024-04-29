import {
  Controller,
  Param,
  Get,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { PlanService } from './plans.service';
import { Plan as PlanModel } from './schemas/plan.schema';

@Controller('tasks')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() plan: PlanModel): Promise<PlanModel> {
    return this.planService.create(plan);
  }

  @Get()
  async findAll(): Promise<PlanModel[]> {
    return (await this.planService.findAll()).reverse();
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
  remove(@Param('id') id: string): Promise<PlanModel> {
    return this.planService.remove(id);
  }
}
