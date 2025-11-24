import { z } from 'zod';

import type { TGuessPicture } from '../../types/guess-picture';
import { publicProcedure } from '../trpc';

export const getById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }): Promise<TGuessPicture | null> => {
    const result = await ctx.prisma.guessPicture.findUnique({
      where: { id: input.id },
      include: {
        questions: true,
      },
    });

    if (!result) {
      return null;
    }

    return {
      ...result,
      questions: result.questions.map((question) => ({
        id: question.id,
        text: question.text,
        isCorrect: question.isCorrect,
      })),
    };
  });
