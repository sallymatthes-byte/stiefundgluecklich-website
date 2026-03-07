import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: 'StiefundGlücklich — Blog für Bonusmamas',
    description: 'Coaching und Impulse für Bonusmamas in Patchworkfamilien. Von Sally Matthes — Erziehungswissenschaftlerin, Systemischer Coach und selbst Bonusmama.',
    site: context.site!,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.metaDescription || post.data.excerpt || post.data.description || '',
      link: `/blog/${post.slug}/`,
      categories: post.data.category ? [post.data.category] : [],
    })),
    customData: `<language>de-DE</language>
<managingEditor>sallymatthes@googlemail.com (Sally Matthes)</managingEditor>
<copyright>© ${new Date().getFullYear()} StiefundGlücklich</copyright>`,
  });
}
