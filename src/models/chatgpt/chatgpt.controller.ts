import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import OpenAI from 'openai';

import { IPlanRequest, IPlanResponse } from './chatgpt.interfaces';
import { ChatGPTService } from './chatgpt.service';

@Controller('planai')
export class ChatGPTController {
  constructor(private chatGPTService: ChatGPTService) {}

  @Post('/create')
  @HttpCode(200)
  async makePlan(@Body() request: IPlanRequest): Promise<IPlanResponse> {
    const getMessages = (await this.chatGPTService.getPlanData(
      request,
    )) as OpenAI.ChatCompletion;
    return this.chatGPTService.getAIPlanResponse(getMessages);
  }
}
