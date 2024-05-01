export interface ITask {
  title: string;
  description: string;
  week: number;
}

export interface IPlanRequest {
  goal: string;
  numWeeks: number;
}

export interface IPlanResponse {
  success: boolean;
  result: ITask[];
}
