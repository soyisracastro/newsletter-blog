import type { APIRoute } from 'astro';
import { generateOgImage } from '../../../lib/og';

export const GET: APIRoute = async () => {
  const png = await generateOgImage({
    title: 'La IA ya está en los despachos',
    description:
      'El problema no es que no la uses.\nEl problema es que no sabes qué tan mal la estás usando.',
    subtitle: 'Ebook · columna13.club',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
