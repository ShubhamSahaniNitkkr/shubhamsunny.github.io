#!/usr/bin/env node
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const excelPath = path.join(root, 'site-data.xlsx');

function runSync() {
  try {
    execSync('node scripts/sync-excel.mjs', { cwd: root, stdio: 'inherit' });
  } catch {
    console.error('Sync failed — check site-data.xlsx');
  }
}

if (!fs.existsSync(excelPath)) {
  console.log('Creating site-data.xlsx...');
  execSync('node scripts/init-excel.mjs', { cwd: root, stdio: 'inherit' });
}

runSync();

let debounce = null;
fs.watch(excelPath, () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    console.log('\n📊 site-data.xlsx changed — syncing...');
    runSync();
  }, 600);
});

console.log('\n🚀 Starting dev server (Excel auto-sync enabled)\n');

const child = spawn('npx', ['astro', 'dev', '--force'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'development' },
});
child.on('exit', (code) => process.exit(code ?? 0));
