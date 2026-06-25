#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mediaRoot = path.join(root, 'public', 'media', 'transformations');

const pairs = [
  {
    id: 'transform-1',
    before: 'https://web.archive.org/web/19981202213404/http://www.healthfinder.gov/',
    after: 'https://www.aspendental.com/',
  },
  {
    id: 'transform-2',
    before: 'https://web.archive.org/web/19990125120341/http://www.dominos.com/',
    after: 'https://www.texasroadhouse.com/',
  },
  {
    id: 'transform-3',
    before: 'https://web.archive.org/web/19981111184830/http://www.abanet.org/',
    after: 'https://www.skadden.com/',
  },
];

async function captureBefore(page, url, outPath) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(5000);
  await page.addStyleTag({
    content: `
      #wm-ipp-base, #donato, #wm-ipp-print, .wb-autocomplete-suggestions,
      #wm-toolbar, #wm-ipp, .wb-banner { display: none !important; }
    `,
  });
  await page.waitForTimeout(1000);

  const iframe = page.locator('iframe#playback').first();
  if ((await iframe.count()) > 0) {
    await iframe.screenshot({ path: outPath, type: 'jpeg', quality: 92 });
    return;
  }

  await page.screenshot({ path: outPath, type: 'jpeg', quality: 92, clip: { x: 0, y: 72, width: 1440, height: 900 } });
}

async function captureAfter(page, url, outPath) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  const dismiss = [
    'button:has-text("Accept")',
    'button:has-text("Accept All")',
    'button:has-text("Agree")',
    'button:has-text("Close")',
    '#onetrust-accept-btn-handler',
    '[aria-label="Close"]',
  ];
  for (const sel of dismiss) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 800 })) await btn.click({ timeout: 2000 });
    } catch { /* */ }
  }
  try {
    await page.waitForSelector('img[src], picture, [style*="background-image"]', { timeout: 12000 });
  } catch { /* */ }
  await page.waitForTimeout(4000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1440, height: 900 } });
}

async function capturePair({ id, before, after }, mode = 'both') {
  const dir = path.join(mediaRoot, id);
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    if (mode !== 'after') {
      await captureBefore(page, before, path.join(dir, 'before.jpg'));
      console.log(`✓ ${id}/before.jpg`);
    }
    if (mode !== 'before') {
      await captureAfter(page, after, path.join(dir, 'after.jpg'));
      console.log(`✓ ${id}/after.jpg`);
    }
  } finally {
    await browser.close();
  }
}

const args = process.argv.slice(2);
const mode = args.includes('before') ? 'before' : args.includes('after') ? 'after' : 'both';
const only = args.filter((a) => a.startsWith('transform-'));
const selected = only.length ? pairs.filter((p) => only.includes(p.id)) : pairs;
for (const pair of selected) await capturePair(pair, mode);
