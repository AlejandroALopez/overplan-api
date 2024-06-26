import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import OpenAI from 'openai';

import { IPlanRequest, IPlanResponse } from './chatgpt.interfaces';
import { ChatGPTService } from './chatgpt.service';
import { SkipAuth } from '../auth/constants';

@Controller('planai')
export class ChatGPTController {
  constructor(private chatGPTService: ChatGPTService) {}

  @SkipAuth()
  @Post('/create')
  @HttpCode(200)
  async makePlan(@Body() request: IPlanRequest): Promise<IPlanResponse> {
    const getMessages = (await this.chatGPTService.getPlanData(
      request,
    )) as OpenAI.ChatCompletion;
    return this.chatGPTService.getAIPlanResponse(getMessages);
  }
}
