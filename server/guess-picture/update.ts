import { guessPictureSchema } from '@/schemas/guess-picture';
import { z } from 'zod';

import type { TGuessPicture } from '../../types/guess-picture';
import { developmentOnlyProcedure } from '../trpc';

export const update = developmentOnlyProcedure
  .input(
    z.object({
      id: z.string(),
      data: guessPictureSchema,
    }),
  )
  .mutation(async ({ ctx, input }): Promise<TGuessPicture> => {
    const result = await ctx.prisma.guessPicture.update({
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
