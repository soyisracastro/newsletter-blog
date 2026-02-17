// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://todoconta.com',
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_SENDY_LIST_ID: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_SENDY_ACTION_URL: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_SENDY_API_KEY: envField.string({ context: 'client', access: 'public' }),
    },
  },
});