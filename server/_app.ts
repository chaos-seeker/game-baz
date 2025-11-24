import { create as createGuessPicture } from './guess-picture/create';
import { deleteGuessPicture } from './guess-picture/delete';
import { getAll as getAllGuessPictures } from './guess-picture/get-all';
import { getById as getGuessPictureById } from './guess-picture/get-by-id';
import { getRandom as getRandomGuessPicture } from './guess-picture/get-random';
import { update as updateGuessPicture } from './guess-picture/update';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  guessPicture: createTRPCRouter({
    create: createGuessPicture,
    getAll: getAllGuessPictures,
    getById: getGuessPictureById,
    update: updateGuessPicture,
    delete: deleteGuessPicture,
    getRandom: getRandomGuessPicture,
  }),
});

export type AppRouter = typeof appRouter;
