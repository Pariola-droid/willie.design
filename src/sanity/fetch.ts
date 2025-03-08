import { client } from '@/sanity/client';

import {
  WORK_QUERY,
  WORKS_QUERY,
  WORKS_SLUGS_QUERY,
} from '@/sanity/queries/works';
import { Work } from '../../sanity.types';

export const fetchSanityWorks = async (): Promise<Work[]> => {
  try {
    const sanityWorks = await client.fetch<Work[]>(WORKS_QUERY);
    return sanityWorks;
  } catch (err) {
    console.error('Error fetching works:', err);
    throw err;
  }
};

export const fetchSanityWorkBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<Work> => {
  try {
    const currentWorkData = await client.fetch<Work>(WORK_QUERY, {
      slug,
    });
    return currentWorkData;
  } catch (err) {
    console.error('Error fetching work by slug:', err);
    throw err;
  }
};

export const fetchSanityWorkSlugs = async (): Promise<{ slug: string }[]> => {
  try {
    const slugs = await client.fetch<{ slug: string }[]>(WORKS_SLUGS_QUERY);
    return slugs;
  } catch (err) {
    console.error('Error fetching work slugs:', err);
    throw err;
  }
};
