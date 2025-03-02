'use client';

import { client } from '@/sanity/client';
import { SanityDocument } from 'next-sanity';
import { usePathname } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
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
  isCaseStudyLoading: boolean;
  error: Error | null;
  fetchWorks: () => Promise<void>;
  fetchWorkBySlug: (slug: string) => Promise<void>;
}

const WorksContext = createContext<WorksContextType>({
  works: [],
  currentWork: null,
  nextWork: null,
  isLoading: false,
  isCaseStudyLoading: false,
  error: null,
  fetchWorks: async () => {},
  fetchWorkBySlug: async () => {},
});

export const useWorks = () => useContext(WorksContext);

export const WorksProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const [works, setWorks] = useState<IWorkDocument[]>([]);
  const [currentWork, setCurrentWork] = useState<IWorkDocument | null>(null);
  const [nextWork, setNextWork] = useState<IWorkDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCaseStudyLoading, setIsCaseStudyLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith('/works/')) {
      setCurrentWork(null);
      setNextWork(null);
    }
  }, [pathname]);

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
        publishedAt,
        collab,
        accolades,
        "caseStudyImages": caseStudyImages[]{
          "url": asset->url,
          "alt": alt,
          "position": position
        }
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

        if (works.length > 0) {
          const currentWorkData = works.find(
            (work) => work.slug.current === slug
          );

          if (currentWorkData) {
            setCurrentWork(currentWorkData);

            const currentIndex = works.findIndex(
              (work) => work.slug.current === slug
            );
            const nextIndex = (currentIndex + 1) % works.length;
            setNextWork(works[nextIndex]);

            setIsLoading(false);
            return;
          }
        }

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

  const value = useMemo(() => {
    return {
      works,
      currentWork,
      nextWork,
      isLoading,
      isCaseStudyLoading,
      error,
      fetchWorks,
      fetchWorkBySlug,
    };
  }, [
    works,
    currentWork,
    nextWork,
    isLoading,
    isCaseStudyLoading,
    error,
    fetchWorks,
    fetchWorkBySlug,
  ]);

  return (
    <WorksContext.Provider value={value}>{children}</WorksContext.Provider>
  );
};
