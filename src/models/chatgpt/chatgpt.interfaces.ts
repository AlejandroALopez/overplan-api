import OpenAI from 'openai';

export interface IPlanRequest {
  goal: string;
  numWeeks: number;
}

export interface IPlanResponse {
  success: boolean;
  result: OpenAI.ChatCompletion.Choice;
}
