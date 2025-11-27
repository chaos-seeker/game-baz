import { os } from '@orpc/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const guessPictureDelete = os
  .input(z.object({ id: z.string() }))
  .output(
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
  )
  .handler(async ({ input }: { input: { id: string } }) => {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('دسترسی محدود شده!');
    }

    const result = await prisma.guessPicture.delete({
      where: { id: input.id },
      include: {
        questions: true,
      },
    });

    return {
      ...result,
      questions: result.questions.map((question) => ({
        id: question.id,
        text: question.text,
        isCorrect: question.isCorrect,
      })),
    };
  });
