import { guessPictureRouter } from './routers/guess-picture';
import { createTRPCRouter, publicProcedure } from './trpc';

export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok' };
  }),
  guessPicture: guessPictureRouter,
});

export type AppRouter = typeof appRouter;
