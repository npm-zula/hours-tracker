// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    analytics: true,
    webAnalytics: true,
    speedInsights: true,
    runtime: 'nodejs18.x'
  }),
  integrations: [tailwind()]
});