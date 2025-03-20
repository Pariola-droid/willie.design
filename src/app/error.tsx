'use client';

import GlobalError from '@/components/common/GlobalError';
import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorState, setErrorState] = useState<Error | null>(null);

  useEffect(() => {
    let formattedError: Error;

    if (error.message.includes('network') || error.message.includes('fetch')) {
      formattedError = new Error('Network connection issue');
    } else if (error.message.includes('timeout')) {
      formattedError = new Error('Request timed out');
    } else if (
      error.message.includes('permission') ||
      error.message.includes('auth')
    ) {
      formattedError = new Error('Permission denied');
    } else {
      formattedError = new Error('Something went wrong');
    }

    formattedError.stack = error.stack;

    setErrorState(formattedError);

    console.error('Application error:', error);
  }, [error]);

  return <GlobalError error={errorState} resetError={reset} />;
}
