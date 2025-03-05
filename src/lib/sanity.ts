import { SlugValidationContext } from 'sanity';

export async function isUniqueAcrossAllDocuments(
  slug: string,
  context: SlugValidationContext
) {
  const { document, getClient } = context;

  if (!document?._id) {
    return true;
  }

  const client = getClient({ apiVersion: '2025-02-25' });
  const id = document._id.replace(/^drafts\./, '');
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
  };

  const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;
  const result = await client.fetch(query, params);
  return result;
}
