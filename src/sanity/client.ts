import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: 'u1a93ifs',
  dataset: 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
});
