import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPlanRequest, IPlanResponse } from './chatgpt.interfaces';
import OpenAI from 'openai';
import { generatePrompt, TOOLS, MAX_TOKENS } from './chatgpt.constants';

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
    const userPrompt = `Goal: ${request.goal}\nWeeks: ${request.numWeeks}`;
    const systemPrompt = generatePrompt(request.numWeeks);

    return this.chatgptService.chat.completions.create({
      model: this.configService.get('OPENAI_API_MODEL'),
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      tools: TOOLS as OpenAI.Chat.Completions.ChatCompletionTool[],
      tool_choice: 'required',
      max_tokens: MAX_TOKENS,
    });
  }

  getAIPlanResponse(message: OpenAI.ChatCompletion): IPlanResponse {
    let allTasks = [];

    // Build array with all tasks from GPT tool calls (each contains the tasks for one week)
    for (const call of message.choices[0].message.tool_calls) {
      const callJSON = JSON.parse(call.function.arguments);
      allTasks = [...allTasks, ...callJSON.tasks];
    }

    return {
      success: true,
      result: allTasks,
    };
  }
}
