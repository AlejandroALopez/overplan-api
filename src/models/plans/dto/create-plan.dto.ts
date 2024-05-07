export class CreatePlanDto {
  slug: string;
  userId: string;
  goal: string;
  numWeeks: number;
  active: boolean;
  startDate: string;
  weekEndDate: string;
}
