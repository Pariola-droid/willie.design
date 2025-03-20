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
    setErrorState(error);

    console.error('Application error:', error);
  }, [error]);

  return <GlobalError error={errorState} resetError={reset} />;
}
