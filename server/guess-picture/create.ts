import { guessPictureSchema } from '@/schemas/guess-picture';

import type { TGuessPicture } from '../../types/guess-picture';
import { developmentOnlyProcedure } from '../trpc';

export const create = developmentOnlyProcedure
  .input(guessPictureSchema)
  .mutation(async ({ ctx, input }): Promise<TGuessPicture> => {
    const result = await ctx.prisma.guessPicture.create({
      data: {
        image: input.image,
        questions: {
          create: input.questions.map((question) => ({
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
