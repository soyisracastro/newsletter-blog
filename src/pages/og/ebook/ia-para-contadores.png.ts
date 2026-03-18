import type { APIRoute } from 'astro';
import { generateOgImage } from '../../../lib/og';

export const GET: APIRoute = async () => {
  const png = await generateOgImage({
    title: 'IA para Contadores',
    subtitle: 'columna13.club',
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
