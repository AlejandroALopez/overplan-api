import {
  Controller,
  Param,
  Body,
  Req,
  Get,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(
    @Param('id') userId: string,
    @Req() req: any,
  ): Promise<UserModel> {
    const tokenUserId = req.user.userId;

    if (userId !== tokenUserId) {
      throw new ForbiddenException('You are not allowed to get this user.');
    }

    return this.usersService.findOneById(userId);
  }

  @Put(':id')
  async update(
    @Param('id') userId: string,
    @Body() user: Partial<UserModel>,
    @Req() req: any,
  ): Promise<UserModel> {
    const tokenUserId = req.user.userId;

    if (userId !== tokenUserId) {
      throw new ForbiddenException('You are not allowed to update this user.');
    }

    return this.usersService.update(userId, user);
  }
}
