import { getCollection } from 'astro:content';

/**
 * Gibt alle veröffentlichten Blog-Posts zurück.
 * Filtert: draft === true UND publishDate in der Zukunft
 */
export async function getPublishedPosts() {
  const now = new Date();
  const posts = await getCollection('blog', ({ data }) => {
    if (data.draft) return false;
    if (data.publishDate && new Date(data.publishDate) > now) return false;
    return true;
  });
  return posts;
}
