// Generates prompt, with custom # tasks/wk depending on number of weeks
export const generatePrompt = (numWeeks: number) => {
  let tasksPerWeek: number;

  switch (numWeeks) {
    case 1:
    case 2:
    case 3:
      tasksPerWeek = 6;
      break;
    case 4:
    case 5:
    case 6:
      tasksPerWeek = 4;
      break;
    default: // 7+
      tasksPerWeek = 3;
      break;
  }

  return `You are a plan builder that creates a list of tasks for a given goal and fixed number of weeks. \
  Always provide at least ${tasksPerWeek} tasks for each week. Always provide detailed descriptions for each task, \
  including specific examples when necessary. Always provide your result in JSON format.`;
};

export const MAX_TOKENS: number = 2000; // max supported by model: 4096

// Formats GPT result.
// i.e. tasks { Task[] }
export const TOOLS = [
  {
    type: 'function',
    function: {
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
  },
];
