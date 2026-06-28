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
      // Vite 8 Rolldown prebundles production React stubs (jsxDEV = void 0) unless
      // NODE_ENV is forced to development during dev dependency optimization.
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'framer-motion',
      ],
    },
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('framer-motion')) return 'motion';
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': { target: 'http://127.0.0.1:3001', changeOrigin: true },
      },
    },
  },
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        const url = item.url;
        if (url === 'https://shubhamsunny.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (
          url.includes('website-redesign') ||
          url.includes('modernize') ||
          url.includes('dentists') ||
          url.includes('restaurant') ||
          url.includes('professional-services')
        ) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (url.includes('/services/')) {
          item.priority = 0.85;
          item.changefreq = 'weekly';
        } else if (url.endsWith('/blog')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (url.includes('/blog/')) {
          item.priority = 0.75;
          item.changefreq = 'monthly';
        } else if (url.includes('/templates') || url.includes('/products')) {
          item.priority = 0.65;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        }
        return item;
      },
    }),
  ],
});
