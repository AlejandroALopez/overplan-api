import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPlanRequest, IPlanResponse } from './chatgpt.interfaces';
import OpenAI from 'openai';
import { generatePrompt, FUNCTIONS, MAX_TOKENS } from './chatgpt.constants';

@Injectable()
export class ChatGPTService {
  private chatgptService: OpenAI;

  constructor(private configService: ConfigService) {
    this.chatgptService = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  // Get array of tasks from ChatGPT based on goal and weeks
  async getPlanData(request: IPlanRequest): Promise<OpenAI.ChatCompletion> {
    const userPrompt = `Goal: ${request.goal}\nMax weeks: ${request.numWeeks}`;
    const systemPrompt = generatePrompt(request.numWeeks);

    return this.chatgptService.chat.completions.create({
      model: this.configService.get('OPENAI_API_MODEL'),
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      functions: FUNCTIONS,
      function_call: 'auto',
      max_tokens: MAX_TOKENS,
    });
  }

  getAIPlanResponse(message: OpenAI.ChatCompletion): IPlanResponse {
    const resultJSON =
      message?.choices?.length &&
      JSON.parse(message.choices[0].message.function_call.arguments);
    return {
      success: true,
      result: resultJSON.tasks,
    };
  }
}
