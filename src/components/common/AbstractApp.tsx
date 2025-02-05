'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import React from 'react';
// import { LazyMotion, domAnimation } from "framer-motion";

import 'blaze-slider/dist/blaze.css';
import 'splitting/dist/splitting-cells.css';
import 'splitting/dist/splitting.css';
import '../../styles/index.scss';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: 3 * 60 * 1000,
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const queryClient = getQueryClient();

interface AbstractAppProps extends React.PropsWithChildren {
  initialSession?: any;
}

const AbstractApp = (pageProps: AbstractAppProps) => {
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  return (
    <div>
      {isClientReady && (
        <QueryClientProvider client={queryClient}>
          {pageProps?.children}
        </QueryClientProvider>
      )}
    </div>
  );
};

export default AbstractApp;
