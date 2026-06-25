#!/usr/bin/env node
/** Patch existing site-data.xlsx with new Site + Portfolio fields */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const excelPath = path.join(__dirname, '..', 'site-data.xlsx');

if (!fs.existsSync(excelPath)) {
  console.error('Run npm run init:excel first');
  process.exit(1);
}

const wb = XLSX.readFile(excelPath);
const siteName = 'Site';
const siteRows = XLSX.utils.sheet_to_json(wb.Sheets[siteName], { defval: '' });
const siteMap = Object.fromEntries(
  siteRows.map((r) => [String(r.field || '').trim(), String(r.value ?? '').trim()]),
);

const additions = {
  notify_on_visit: 'yes',
  chatbot_enabled: 'yes',
  email_consultation: "Hi Shubham,\n\nI saw your website and I'd like a free review of my business website.\n\nThanks!",
  email_package: "Hi Shubham,\n\nI'm interested in the {packageName} package (${price}). Can we discuss?\n\nThanks!",
  email_general: 'Hi Shubham,\n\nI visited your website and would like to know more about website modernization.\n\nThanks!',
  hero_image: '/media/team/shubham.jpg',
  cache_version: '1.1.0',
};

for (const [field, value] of Object.entries(additions)) {
  if (!siteMap[field]) siteRows.push({ field, value });
}

wb.Sheets[siteName] = XLSX.utils.json_to_sheet(siteRows);

// Patch portfolio bento + cover
const portName = 'Portfolio';
if (wb.Sheets[portName]) {
  const portRows = XLSX.utils.sheet_to_json(wb.Sheets[portName], { defval: '' });
  const bentos = ['feature', 'tall', 'wide', 'standard'];
  portRows.forEach((row, i) => {
    if (!row.cover_file) row.cover_file = 'cover.svg';
    if (!row.bento) row.bento = bentos[i % bentos.length];
  });
  wb.Sheets[portName] = XLSX.utils.json_to_sheet(portRows);
}

// Single hero row
if (wb.Sheets.Hero) {
  wb.Sheets.Hero = XLSX.utils.json_to_sheet([
    { order: 1, folder: 'team', file: 'shubham.jpg', alt: 'Shubham Sunny — website modernization expert' },
  ]);
}

XLSX.writeFile(wb, excelPath);
console.log('✓ Patched site-data.xlsx');
