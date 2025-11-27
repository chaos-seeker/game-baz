'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, Suspense, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import type { RouterClient } from '@orpc/server';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { AppRouter } from '@/server/router';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

const link = new RPCLink({
  url: `${getBaseUrl()}/api/rpc`,
});

export const orpc: RouterClient<AppRouter> = createORPCClient(link);

const Bprogress = (props: PropsWithChildren) => {
  return (
    <ProgressProvider
      height="4px"
      color="#ffffff"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {props.children}
    </ProgressProvider>
  );
};

const QueryClientProviderWrapper = (props: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};

const HotToast = () => {
  return <Toaster position="top-center" containerClassName="toaster-wrapper" />;
};

export const Providers = (props: PropsWithChildren) => {
  return (
    <>
      <Bprogress>
        <QueryClientProviderWrapper>
          <Suspense>
            <HotToast />
            {props.children}
          </Suspense>
        </QueryClientProviderWrapper>
      </Bprogress>
    </>
  );
};

