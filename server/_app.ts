import { guessPictureRouter } from './routers/guess-picture';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  guessPicture: guessPictureRouter,
});

export type AppRouter = typeof appRouter;
