export const SYSTEM_PROMPT: string =
  'You are a plan builder that creates a list of tasks for a given goal and max number of weeks. Always provide your result in JSON format.';

export const MAX_TOKENS: number = 1000;

export const FUNCTIONS = [
  {
    name: 'write_task',
    description: 'Shows the title, week number, and description of a task',
    parameters: {
      type: 'object',
      properties: {
        tasks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'Title of the task',
              },
              description: {
                type: 'string',
                description: 'Description of the task',
              },
              week: {
                type: 'number',
                description: 'Week number of the task',
              },
            },
            required: ['title', 'description', 'week'],
          },
        },
      },
      required: ['tasks'],
    },
  },
];
