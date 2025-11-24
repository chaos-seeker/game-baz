import type { PrismaClient } from '@/generated/prisma/client';
import { initTRPC, TRPCError } from '@trpc/server';

import { prisma } from '../lib/prisma';

export interface Context {
  prisma: PrismaClient;
}

export const createTRPCContext = async () => {
  return {
    prisma,
  };
};

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const router = t.router;
export const publicProcedure = t.procedure;
export const developmentOnlyProcedure = t.procedure.use(({ next }) => {
  if (process.env.NODE_ENV !== 'development') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'دسترسی محدود شده!',
    });
  }

  return next();
});
