// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

/** @type {import('vite').Plugin} */
function devReactOptimize() {
  return {
    name: 'dev-react-optimize',
    config(_, { command }) {
      if (command !== 'serve') return;
      return {
        optimizeDeps: {
          rolldownOptions: {
            transform: {
              define: {
                'process.env.NODE_ENV': '"development"',
              },
            },
          },
        },
      };
    },
  };
}

export default defineConfig({
  site: 'https://shubhamsunny.com',
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss(), devReactOptimize()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
    build: {
      cssMinify: true,
    },
  },
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        if (item.url === 'https://shubhamsunny.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        return item;
      },
    }),
  ],
});
