import type { TGuessPicture } from '../../types/guess-picture';
import { publicProcedure } from '../trpc';

export const getAll = publicProcedure.query(
  async ({ ctx }): Promise<TGuessPicture[]> => {
    const results = await ctx.prisma.guessPicture.findMany({
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
  },
);
