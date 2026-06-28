#!/usr/bin/env node
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

function clearStaleDevServer() {
  try {
    execSync('npx astro dev stop', { cwd: root, stdio: 'ignore' });
  } catch {
    // No managed dev server — continue.
  }

  try {
    const pids = execSync('lsof -ti :4321', { encoding: 'utf8' }).trim();
    if (pids) {
      console.log('Stopping stale process on port 4321...');
      execSync(`kill ${pids.split('\n').join(' ')}`);
    }
  } catch {
    // Port is free.
  }
}

console.log('\n🚀 Starting dev server (Excel auto-sync enabled)\n');

clearStaleDevServer();

// Drop stale Vite dep cache so a prior production build cannot poison dev React.
try {
  fs.rmSync(path.join(root, 'node_modules', '.vite'), { recursive: true, force: true });
} catch {
  // Cache may not exist yet.
}

const child = spawn('npx', ['astro', 'dev', '--force'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' },
});
child.on('exit', (code) => process.exit(code ?? 0));
