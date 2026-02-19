import type { APIRoute } from 'astro';
import { generateOgImage } from '../../lib/og';

export const GET: APIRoute = async () => {
  const png = await generateOgImage({
    title: 'Columna 13',
    description:
      'En la universidad te enseñaron 12 columnas.\nLa que falta es la que te haría ganar más dinero.',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
