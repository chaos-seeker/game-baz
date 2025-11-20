import { appRouter } from '../../../../server/_app';
import { createTRPCContext } from '../../../../server/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => createTRPCContext(),
    onError({ error, path }) {
      console.error(`tRPC Error on '${path}':`, error);
    },
  });
};

export { handler as GET, handler as POST };
