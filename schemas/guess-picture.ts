import { questionSchema } from './question';
import { z } from 'zod';

export const guessPictureSchema = z.object({
  image: z.string(),
  questions: z.array(questionSchema),
});
