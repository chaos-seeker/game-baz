import { z } from 'zod';
import { developmentOnlyProcedure } from '../trpc';

export const deleteGuessPicture = developmentOnlyProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.guessPicture.delete({
      where: { id: input.id },
    });
  });
