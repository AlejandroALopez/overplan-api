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
import { BadgeService } from './badges.service';
import { Badge as BadgeModel } from './schemas/badge.schema';
import { CreateBadgeDto } from './dto/create-badge.dto';

@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  async create(@Body() task: CreateBadgeDto): Promise<BadgeModel> {
    return this.badgeService.create(task);
  }

  // GET /badges - Retrieve all badges by userId if provided
  @Get()
  async findAll(@Query('userId') userId?: string): Promise<BadgeModel[]> {
    if (userId) {
      return await this.badgeService.findByUserId(userId);
    } else {
      return await this.badgeService.findAll();
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BadgeModel> {
    return this.badgeService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() badge: BadgeModel,
  ): Promise<BadgeModel> {
    return this.badgeService.update(id, badge);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BadgeModel> {
    return this.badgeService.remove(id);
  }
}
