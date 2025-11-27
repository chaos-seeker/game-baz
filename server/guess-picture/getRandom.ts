import { os } from '@orpc/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import type { TGuessPicture } from '../../types/guess-picture';

export const guessPictureGetRandom = os
  .input(z.void())
  .output(
    z
      .object({
        id: z.string(),
        image: z.string(),
        questions: z.array(
          z.object({
            id: z.number(),
            text: z.string(),
            isCorrect: z.boolean(),
          }),
        ),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .nullable(),
  )
  .handler(async (): Promise<TGuessPicture | null> => {
    const count = await prisma.guessPicture.count();
    if (count === 0) {
      return null;
    }

    const randomSkip = Math.floor(Math.random() * count);
    const result = await prisma.guessPicture.findFirst({
      skip: randomSkip,
      include: {
        questions: true,
      },
    });

    if (!result) {
      return null;
    }

    const mapped = {
      ...result,
      questions: result.questions.map((question) => ({
        id: question.id,
        text: question.text,
        isCorrect: question.isCorrect,
      })),
    };
    const shuffledQuestions = [...mapped.questions].sort(
      () => Math.random() - 0.5,
    );

    return {
      ...mapped,
      questions: shuffledQuestions,
    };
  });
