import type { APIRoute, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../lib/og';

export async function getStaticPaths() {
  const newsletters = await getCollection('newsletters');
  return newsletters.map((nl) => ({
    params: { id: nl.id.replace(/^\d{4}-\d{2}-\d{2}-/, '') },
    props: { newsletter: nl },
  }));
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async ({ props }) => {
  const { newsletter } = props as Props;

  const png = await generateOgImage({
    title: newsletter.data.title,
    subtitle: 'Columna 13',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
