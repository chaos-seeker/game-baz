import type { TGuessPicture } from '../../types/guess-picture';
import type { TQuestion } from '../../types/question';
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
          questions: input.questions as TQuestion[],
        },
      });
      return {
        ...result,
        questions: result.questions as TQuestion[],
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }): Promise<TGuessPicture[]> => {
    const results = await ctx.prisma.guessPicture.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return results.map((item: (typeof results)[number]) => ({
      ...item,
      questions: item.questions as TQuestion[],
    }));
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<TGuessPicture | null> => {
      const result = await ctx.prisma.guessPicture.findUnique({
        where: { id: input.id },
      });
      if (!result) return null;
      return {
        ...result,
        questions: result.questions as TQuestion[],
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
          questions: input.data.questions as TQuestion[],
        },
      });
      return {
        ...result,
        questions: result.questions as TQuestion[],
      };
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.guessPicture.delete({
        where: { id: input.id },
      });
    }),
});
