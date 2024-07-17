import {
  Controller,
  Param,
  Body,
  Get,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserModel> {
    return this.usersService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: Partial<UserModel>,
  ): Promise<UserModel> {
    return this.usersService.update(id, user);
  }
}
