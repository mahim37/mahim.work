// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mahim.work',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  build: {
    // The stylesheet is small; inlining it means every page is one request.
    inlineStylesheets: 'always',
  },
});
