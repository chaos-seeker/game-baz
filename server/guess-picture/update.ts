import { os } from '@orpc/server';
import { z } from 'zod';
import { guessPictureSchema } from '@/schemas/guess-picture';
import { prisma } from '@/lib/prisma';
import type { TGuessPicture } from '../../types/guess-picture';

export const guessPictureUpdate = os
  .input(
    z.object({
      id: z.string(),
      data: guessPictureSchema,
    }),
  )
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
  .handler(async ({ input }): Promise<TGuessPicture> => {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('دسترسی محدود شده!');
    }

    const result = await prisma.guessPicture.update({
      where: { id: input.id },
      data: {
        image: input.data.image,
        questions: {
          deleteMany: {},
          create: input.data.questions.map((question) => ({
            text: question.text,
            isCorrect: question.isCorrect,
          })),
        },
      },
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
