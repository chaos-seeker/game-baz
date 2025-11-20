import { z } from 'zod';

export const questionSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean(),
});
