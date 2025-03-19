'use client';

import { fetchSanityWorks } from '@/sanity/fetch';
import { usePathname } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Work } from '../../sanity.types';

interface WorksContextType {
  works: Work[];
  isLoading: boolean;
  error: Error | null;
  fetchWorks: () => Promise<void>;
}

const WorksContext = createContext<WorksContextType>({
  works: [],
  isLoading: false,
  error: null,
  fetchWorks: async () => {},
});

export const useWorks = () => useContext(WorksContext);

export const WorksProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorks = useCallback(async () => {
    try {
      document.documentElement.style.setProperty('--cursor', 'wait');
      setIsLoading(true);
      setError(null);

      const works = await fetchSanityWorks();
      setWorks(works);
    } catch (err) {
      console.error('Error fetching works:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      document.documentElement.style.setProperty('--cursor', 'auto');
    } finally {
      setIsLoading(false);
      document.documentElement.style.setProperty('--cursor', 'auto');
    }
  }, []);

  const value = useMemo(() => {
    return {
      works,
      isLoading,
      error,
      fetchWorks,
    };
  }, [works, isLoading, error, fetchWorks]);

  return (
    <WorksContext.Provider value={value}>{children}</WorksContext.Provider>
  );
};
