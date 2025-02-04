'use client';

import { darkTheme, globalStyles } from '@/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import React from 'react';
// import { LazyMotion, domAnimation } from "framer-motion";
import { Theme as RadixTheme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import '@radix-ui/themes/styles.css';
import 'blaze-slider/dist/blaze.css';
import '../../styles/animations.scss';

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
  globalStyles();
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      value={{ light: 'light', dark: darkTheme.className }}
    >
      <RadixTheme hasBackground={false}>
        <div>
          {isClientReady && (
            <QueryClientProvider client={queryClient}>
              {pageProps?.children}
            </QueryClientProvider>
          )}
        </div>
      </RadixTheme>
      <Toaster
        richColors
        position="top-right"
        style={{
          zIndex: 9999999999,
        }}
      />
    </ThemeProvider>
  );
};

export default AbstractApp;
