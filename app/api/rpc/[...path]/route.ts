import { router } from '@/server/router';
import { RPCHandler } from '@orpc/server/fetch';

const handler = new RPCHandler(router);

async function handleRequest(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const url = new URL(request.url);
  url.pathname = `/${(await params).path.join('/')}`;
  const result = await handler.handle(new Request(url, request));
  return result.response;
}

export { handleRequest as GET, handleRequest as POST };
