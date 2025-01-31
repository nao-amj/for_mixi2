// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://nao-amj.github.io//',
    outDir: "./dist",
    base: 'for_x_mixi2/',
	integrations: [mdx(), sitemap()],
});
