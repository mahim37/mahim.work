import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site, published } from '../lib/site';

export async function GET(context: APIContext) {
  const work = await getCollection('work', published);
  const posts = await getCollection('writing', published);
  const items = [
    ...work.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.date,
      link: `/work/${e.id}/`,
    })),
    ...posts.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.date,
      link: `/writing/${e.id}/`,
    })),
  ].sort((a, b) => +b.pubDate - +a.pubDate);

  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items,
    customData: '<language>en</language>',
  });
}
