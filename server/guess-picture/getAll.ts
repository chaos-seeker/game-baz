import { os } from '@orpc/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import type { TGuessPicture } from '../../types/guess-picture';

export const guessPictureGetAll = os
  .input(z.void())
  .output(
    z.array(
      z.object({
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
      }),
    ),
  )
  .handler(async (): Promise<TGuessPicture[]> => {
    const results = await prisma.guessPicture.findMany({
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return results.map((guessPicture) => ({
      ...guessPicture,
      questions: guessPicture.questions.map((question) => ({
        id: question.id,
        text: question.text,
        isCorrect: question.isCorrect,
      })),
    }));
  });
