import { z } from 'zod';

const questionSchema = z.object({
  id: z.number(),
  text: z.string(),
  isCorrect: z.boolean(),
});

export const guessPictureSchema = z.object({
  image: z.string(),
  questions: z.array(questionSchema),
});
