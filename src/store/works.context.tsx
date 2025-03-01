'use client';

import { client } from '@/sanity/client';
import { SanityDocument } from 'next-sanity';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface IWorkDocument extends SanityDocument {
  featured?: boolean;
  layout?: 'layout_a' | 'layout_b';
  hoverColor?: string;
  title: string;
  slug: { current: string };
  coverImage?: {
    asset: {
      _ref: string;
      url: string;
    };
    alt?: string;
  };
  coverImageUrl?: string;
  coverImageAlt?: string;
  captions?: string[];
  description?: string;
  liveLink?: string;
  publishedAt?: string;
  caseStudyImages?: Array<{
    url: string;
    alt?: string;
    position: string;
  }>;
  collab?: string;
  accolades?: string;
}

interface WorksContextType {
  works: IWorkDocument[];
  currentWork: IWorkDocument | null;
  nextWork: IWorkDocument | null;
  isLoading: boolean;
  error: Error | null;
  fetchWorks: () => Promise<void>;
  fetchWorkBySlug: (slug: string) => Promise<void>;
  resetCurrentWork: () => void;
}

const WorksContext = createContext<WorksContextType>({
  works: [],
  currentWork: null,
  nextWork: null,
  isLoading: false,
  error: null,
  fetchWorks: async () => {},
  fetchWorkBySlug: async () => {},
  resetCurrentWork: () => {},
});

export const useWorks = () => useContext(WorksContext);

export const WorksProvider = ({ children }: { children: ReactNode }) => {
  const [works, setWorks] = useState<IWorkDocument[]>([]);
  const [currentWork, setCurrentWork] = useState<IWorkDocument | null>(null);
  const [nextWork, setNextWork] = useState<IWorkDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const WORKS_QUERY = `*[_type == "work" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        featured,
        layout,
        hoverColor,
        title,
        slug,
        "coverImageUrl": coverImage.asset->url,
        "coverImageAlt": coverImage.alt,
        captions,
        description,
        liveLink,
        publishedAt
      }`;

      const sanityWorks = await client.fetch<IWorkDocument[]>(WORKS_QUERY);
      setWorks(sanityWorks);
    } catch (err) {
      console.error('Error fetching works:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWorkBySlug = useCallback(
    async (slug: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const WORK_QUERY = `*[_type == "work" && slug.current == $slug][0]{
            _id,
            title,
            description,
            "coverImageUrl": coverImage.asset->url,
            "coverImageAlt": coverImage.alt,
            "caseStudyImages": caseStudyImages[]{
              "url": asset->url,
              "alt": alt,
              "position": position
            },
            liveLink,
            collab,
            accolades,
            hoverColor,
            publishedAt,
            captions,
            slug
          }`;

        if (works.length > 0) {
          const workData = works.find((work) => work.slug.current === slug);

          if (workData) {
            const fullWorkData = await client.fetch<IWorkDocument>(WORK_QUERY, {
              slug,
            });

            if (fullWorkData) {
              setCurrentWork(fullWorkData);

              const currentIndex = works.findIndex(
                (work) => work.slug.current === slug
              );
              const nextIndex = (currentIndex + 1) % works.length;
              setNextWork(works[nextIndex]);

              setIsLoading(false);
              return;
            }
          }
        }

        const workData = await client.fetch<IWorkDocument>(WORK_QUERY, {
          slug,
        });

        if (!workData) {
          throw new Error('Case study not found');
        }

        setCurrentWork(workData);

        if (works.length === 0) {
          await fetchWorks();

          const currentIndex = works.findIndex(
            (work) => work.slug.current === slug
          );
          if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % works.length;
            setNextWork(works[nextIndex]);
          }
        }
      } catch (err) {
        console.error('Error fetching work by slug:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    },
    [works, fetchWorks]
  );

  const resetCurrentWork = useCallback(() => {
    setCurrentWork(null);
    setNextWork(null);
  }, []);

  const value = useMemo(() => {
    return {
      works,
      currentWork,
      nextWork,
      isLoading,
      error,
      fetchWorks,
      fetchWorkBySlug,
      resetCurrentWork,
    };
  }, [
    works,
    currentWork,
    nextWork,
    isLoading,
    error,
    fetchWorks,
    fetchWorkBySlug,
    resetCurrentWork,
  ]);

  return (
    <WorksContext.Provider value={value}>{children}</WorksContext.Provider>
  );
};
