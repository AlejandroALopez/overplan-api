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
import { MedalService } from './medals.service';
import { Medal as MedalModel } from './schemas/medal.schema';
import { CreateMedalDto } from './dto/create-medal.dto';

@Controller('medals')
export class MedalController {
  constructor(private readonly medalService: MedalService) {}

  @Post()
  async create(@Body() task: CreateMedalDto): Promise<MedalModel> {
    return this.medalService.create(task);
  }

  // GET /medals - Retrieve all medals by userId if provided
  @Get()
  async findAll(@Query('userId') userId?: string): Promise<MedalModel[]> {
    if (userId) {
      return await this.medalService.findByUserId(userId);
    } else {
      return await this.medalService.findAll();
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MedalModel> {
    return this.medalService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() medal: MedalModel,
  ): Promise<MedalModel> {
    return this.medalService.update(id, medal);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MedalModel> {
    return this.medalService.remove(id);
  }
}
