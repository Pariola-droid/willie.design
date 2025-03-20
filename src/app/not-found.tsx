'use client';

import GlobalError from '@/components/common/GlobalError';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [errorState, setErrorState] = useState<Error | null>(null);

  useEffect(() => {
    const notFoundError = new Error('Page not found');
    setErrorState(notFoundError);
  }, []);

  return <GlobalError error={errorState} />;
}
