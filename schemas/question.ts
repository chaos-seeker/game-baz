import { z } from 'zod';

export const questionSchema = z.object({
  id: z.number(),
  text: z.string(),
  isCorrect: z.boolean(),
});
