// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shubhamsunny.com',
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
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
            if (id.includes('node_modules/react-dom')) return 'react-dom';
            if (id.includes('node_modules/react/')) return 'react';
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
        } else if (url.includes('website-redesign') || url.includes('modernize')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (url.includes('/blog/')) {
          item.priority = 0.75;
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
