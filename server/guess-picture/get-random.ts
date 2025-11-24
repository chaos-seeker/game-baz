import type { TGuessPicture } from '../../types/guess-picture';
import { publicProcedure } from '../trpc';

export const getRandom = publicProcedure.query(
  async ({ ctx }): Promise<TGuessPicture | null> => {
    const count = await ctx.prisma.guessPicture.count();
    if (count === 0) {
      return null;
    }

    const randomSkip = Math.floor(Math.random() * count);
    const result = await ctx.prisma.guessPicture.findFirst({
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
  },
);
