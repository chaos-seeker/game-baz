import { z } from 'zod';

import { publicProcedure } from '../trpc';

export const deleteGuessPicture = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.guessPicture.delete({
      where: { id: input.id },
    });
  });
