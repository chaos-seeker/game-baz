import type { TGuessPicture } from '../../types/guess-picture';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { guessPictureSchema } from '@/schemas/guess-picture';
import { z } from 'zod';

export const guessPictureRouter = createTRPCRouter({
  create: publicProcedure
    .input(guessPictureSchema)
    .mutation(async ({ ctx, input }): Promise<TGuessPicture> => {
      const result = await ctx.prisma.guessPicture.create({
        data: {
          image: input.image,
          questions: {
            create: input.questions.map((q) => ({
              text: q.text,
              isCorrect: q.isCorrect,
            })),
          },
        },
        include: {
          questions: true,
        },
      });
      return {
        ...result,
        questions: result.questions.map(
          (q: (typeof result.questions)[number]) => ({
            id: q.id,
            text: q.text,
            isCorrect: q.isCorrect,
          }),
        ),
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }): Promise<TGuessPicture[]> => {
    const results = await ctx.prisma.guessPicture.findMany({
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return results.map((item: (typeof results)[number]) => ({
      ...item,
      questions: item.questions.map((q: (typeof item.questions)[number]) => ({
        id: q.id,
        text: q.text,
        isCorrect: q.isCorrect,
      })),
    }));
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<TGuessPicture | null> => {
      const result = await ctx.prisma.guessPicture.findUnique({
        where: { id: input.id },
        include: {
          questions: true,
        },
      });
      if (!result) return null;
      return {
        ...result,
        questions: result.questions.map(
          (q: (typeof result.questions)[number]) => ({
            id: q.id,
            text: q.text,
            isCorrect: q.isCorrect,
          }),
        ),
      };
    }),
  update: publicProcedure
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
            create: input.data.questions.map((q) => ({
              text: q.text,
              isCorrect: q.isCorrect,
            })),
          },
        },
        include: {
          questions: true,
        },
      });
      return {
        ...result,
        questions: result.questions.map(
          (q: (typeof result.questions)[number]) => ({
            id: q.id,
            text: q.text,
            isCorrect: q.isCorrect,
          }),
        ),
      };
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.guessPicture.delete({
        where: { id: input.id },
      });
    }),
  getRandom: publicProcedure.query(
    async ({ ctx }): Promise<TGuessPicture | null> => {
      const count = await ctx.prisma.guessPicture.count();
      if (count === 0) return null;
      const randomSkip = Math.floor(Math.random() * count);
      const result = await ctx.prisma.guessPicture.findFirst({
        skip: randomSkip,
        include: {
          questions: true,
        },
      });
      if (!result) return null;
      const mappedQuestions = result.questions.map(
        (q: (typeof result.questions)[number]) => ({
          id: q.id,
          text: q.text,
          isCorrect: q.isCorrect,
        }),
      );
      const shuffledQuestions = [...mappedQuestions].sort(
        () => Math.random() - 0.5,
      );
      return {
        ...result,
        questions: shuffledQuestions,
      };
    },
  ),
});
