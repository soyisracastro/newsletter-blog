import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

let specialElite: Buffer | null = null;
let sourceSerif: Buffer | null = null;

async function loadFonts() {
  const fontsDir = join(process.cwd(), 'src', 'fonts');
  if (!specialElite) {
    specialElite = await readFile(join(fontsDir, 'SpecialElite-Regular.ttf'));
  }
  if (!sourceSerif) {
    sourceSerif = await readFile(join(fontsDir, 'SourceSerif4-Regular.ttf'));
  }
  return { specialElite, sourceSerif };
}

interface OgImageOptions {
  title: string;
  description?: string;
  subtitle?: string;
}

function getTitleSize(title: string) {
  if (title.length > 90) return 36;
  if (title.length > 50) return 48;
  return 64;
}

export async function generateOgImage(options: OgImageOptions): Promise<Buffer> {
  const fonts = await loadFonts();

  const titleSize = getTitleSize(options.title);

  const description =
    options.description && options.description.length > 120
      ? options.description.slice(0, 120) + '...'
      : options.description;

  const children: any[] = [
    {
      type: 'div',
      props: {
        style: {
          backgroundColor: '#111111',
          color: '#ffffff',
          fontFamily: 'Special Elite',
          fontSize: `${titleSize}px`,
          padding: '12px 28px',
          letterSpacing: '0.02em',
          lineHeight: 1.3,
          textAlign: 'center',
          maxWidth: '1000px',
        },
        children: options.title,
      },
    },
  ];

  if (description) {
    const lines = description.split('\n');
    children.push({
      type: 'div',
      props: {
        style: {
          marginTop: '28px',
          fontFamily: 'Source Serif 4',
          fontSize: '26px',
          color: '#666666',
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        children: lines.map((line: string) => ({
          type: 'div',
          props: { children: line },
        })),
      },
    });
  }

  if (options.subtitle) {
    children.push({
      type: 'div',
      props: {
        style: {
          marginTop: '24px',
          fontFamily: 'Source Serif 4',
          fontSize: '22px',
          color: '#999999',
          textAlign: 'center',
        },
        children: options.subtitle,
      },
    });
  }

  const markup = {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: '60px',
      },
      children,
    },
  };

  const svg = await satori(markup as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Special Elite',
        data: fonts.specialElite!,
        weight: 400,
        style: 'normal' as const,
      },
      {
        name: 'Source Serif 4',
        data: fonts.sourceSerif!,
        weight: 400,
        style: 'normal' as const,
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  return Buffer.from(resvg.render().asPng());
}
