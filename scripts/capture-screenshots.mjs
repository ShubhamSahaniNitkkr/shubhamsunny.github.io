#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mediaRoot = path.join(root, 'public', 'media');

const projects = [
  { id: 'massive-data-explorer', url: 'https://mde-web.onrender.com' },
  { id: 'offline-first-task-management', url: 'https://offline-first-task-management-app-ui.onrender.com', folder: 'offline-first' },
  { id: 'server-driven-ui', url: 'https://sdui-pypy.onrender.com', folder: 'sdui' },
  { id: 'frontend-plugin-platform', url: 'https://fpp-host.onrender.com', folder: 'fpp' },
];

async function capture(url, outPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 88, fullPage: false });
    console.log(`✓ ${outPath}`);
  } catch (err) {
    console.error(`✗ ${url}: ${err.message}`);
  } finally {
    await browser.close();
  }
}

for (const p of projects) {
  const folder = p.folder || p.id;
  const dir = path.join(mediaRoot, 'portfolio', folder);
  fs.mkdirSync(dir, { recursive: true });
  await capture(p.url, path.join(dir, 'cover.jpg'));
}
