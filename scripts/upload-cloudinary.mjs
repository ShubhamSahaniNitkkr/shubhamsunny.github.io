#!/usr/bin/env node
/**
 * Upload public/media/* to Cloudinary and write URLs into site-data.xlsx.
 *
 * Setup:
 *   1. Copy .env.example → .env and add Cloudinary credentials
 *   2. npm run upload:cloudinary
 *   3. npm run sync
 *
 * Re-runs skip unchanged files (MD5 hash in cloudinary-manifest.json).
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mediaRoot = path.join(root, 'public/media');
const excelPath = path.join(root, 'site-data.xlsx');
const manifestPath = path.join(root, 'cloudinary-manifest.json');

const VIDEO_EXT = /\.(mp4|mov|webm)$/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg)$/i;
const MEDIA_EXT = /\.(mp4|mov|webm|jpe?g|png|webp|gif|svg)$/i;

function loadEnv() {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function fileHash(filePath) {
  return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
}

function loadManifest() {
  if (!fs.existsSync(manifestPath)) {
    return { version: 1, files: {} };
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function saveManifest(manifest) {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}

function walkMedia(dir, relBase = '') {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const abs = path.join(dir, name);
    const rel = relBase ? `${relBase}/${name}` : name;
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      out.push(...walkMedia(abs, rel));
    } else if (MEDIA_EXT.test(name)) {
      out.push({ rel, abs, name });
    }
  }
  return out;
}

function splitList(str) {
  return String(str || '')
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function isRemoteUrl(val) {
  return /^https?:\/\//i.test(String(val || '').trim());
}

function basenameFromUrlOrFile(val) {
  const raw = String(val || '').trim();
  if (!raw) return '';
  if (isRemoteUrl(raw)) {
    const part = raw.split('/').pop() || '';
    return part.replace(/\?.*$/, '');
  }
  return raw;
}

function lookupUrl(manifest, relPath) {
  return manifest.files[relPath]?.url || '';
}

function lookupUrlByFilename(manifest, filename) {
  const key = Object.keys(manifest.files).find((k) => path.basename(k) === filename);
  return key ? manifest.files[key].url : '';
}

async function uploadOne(file, manifest, { dryRun = false } = {}) {
  const hash = fileHash(file.abs);
  const existing = manifest.files[file.rel];
  if (existing?.hash === hash && existing.url) {
    return { skipped: true, url: existing.url, rel: file.rel };
  }

  const publicId = `dsbs/${file.rel.replace(/\.[^.]+$/, '')}`;
  const resourceType = VIDEO_EXT.test(file.name) ? 'video' : 'image';

  if (dryRun) {
    console.log(`  [dry-run] would upload ${file.rel} → ${publicId}`);
    return { skipped: false, url: existing?.url || `https://dry-run/${publicId}`, rel: file.rel };
  }

  console.log(`  ↑ uploading ${file.rel} (${(fs.statSync(file.abs).size / 1024 / 1024).toFixed(1)} MB)...`);

  const result = await cloudinary.uploader.upload(file.abs, {
    public_id: publicId,
    resource_type: resourceType,
    overwrite: true,
    invalidate: true,
  });

  manifest.files[file.rel] = {
    url: result.secure_url,
    publicId: result.public_id,
    hash,
    bytes: result.bytes,
    resourceType: result.resource_type,
    uploadedAt: new Date().toISOString(),
  };

  return { skipped: false, url: result.secure_url, rel: file.rel };
}

function resolveFileUrls(manifest, folder, files) {
  if (!files.length) return [];
  return files.map((f) => {
    if (isRemoteUrl(f)) return f;
    const rel = folder ? `${folder}/${f}` : f;
    return lookupUrl(manifest, rel) || lookupUrlByFilename(manifest, f) || f;
  });
}

function patchSheetRows(wb, sheetName, patchFn) {
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return 0;
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  let changed = 0;
  const next = rows.map((row) => {
    const updated = patchFn(row);
    if (updated !== row) changed++;
    return updated;
  });
  wb.Sheets[sheetName] = XLSX.utils.json_to_sheet(next);
  return changed;
}

function patchExcel(manifest) {
  if (!fs.existsSync(excelPath)) {
    console.warn('site-data.xlsx not found — URLs saved in cloudinary-manifest.json only');
    return;
  }

  const wb = XLSX.readFile(excelPath);
  let total = 0;

  total += patchSheetRows(wb, 'Portfolio', (row) => {
    const folder = String(row.folder || row.look_id || '').trim();
    const mediaFolder = folder.startsWith('models/') ? folder : `models/${folder}`;

    const videoFiles = splitList(row.video_files);
    const photoFiles = splitList(row.photo_files);
    const coverFile = String(row.cover_file || '').trim();

    const scannedVideos = videoFiles.length
      ? videoFiles
      : walkMedia(path.join(mediaRoot, mediaFolder))
          .filter((f) => VIDEO_EXT.test(f.name))
          .map((f) => f.name);
    const scannedPhotos = photoFiles.length
      ? photoFiles
      : walkMedia(path.join(mediaRoot, mediaFolder))
          .filter((f) => IMAGE_EXT.test(f.name))
          .map((f) => f.name);

    const videoUrls = resolveFileUrls(manifest, mediaFolder, scannedVideos);
    const photoUrls = resolveFileUrls(manifest, mediaFolder, scannedPhotos);

    let coverUrl = coverFile;
    if (coverFile && !isRemoteUrl(coverFile)) {
      coverUrl = lookupUrl(manifest, `${mediaFolder}/${coverFile}`) || lookupUrlByFilename(manifest, coverFile);
    } else if (!coverFile && photoUrls[0]) {
      coverUrl = photoUrls[0];
    } else if (!coverFile && videoUrls[0]) {
      coverUrl = videoUrls[0];
    }

    return {
      ...row,
      cover_file: coverUrl || coverFile,
      video_files: videoUrls.join(', '),
      photo_files: photoUrls.join(', '),
    };
  });

  total += patchSheetRows(wb, 'Transformations', (row) => {
    const folder = String(row.folder || row.media_folder || row.id || '').trim();
    const folderKey = folder.startsWith('transformations/') ? folder : `transformations/${folder}`;
    const before = String(row.before_file || '').trim();
    const after = String(row.after_file || '').trim();

    return {
      ...row,
      ...(before && !isRemoteUrl(before)
        ? { before_file: lookupUrl(manifest, `${folderKey}/${before}`) || before }
        : {}),
      ...(after && !isRemoteUrl(after)
        ? { after_file: lookupUrl(manifest, `${folderKey}/${after}`) || after }
        : {}),
    };
  });

  total += patchSheetRows(wb, 'Hero', (row) => {
    const file = String(row.file_path || row.file || row.filename || '').trim();
    const folder = String(row.folder || '').trim();
    if (!file || isRemoteUrl(file)) return row;
    const rel = folder ? `${folder}/${file}` : file;
    const url = lookupUrl(manifest, rel) || lookupUrlByFilename(manifest, file);
    return url ? { ...row, file_path: url } : row;
  });

  total += patchSheetRows(wb, 'Work', (row) => {
    const folder = String(row.folder || 'work').trim();
    const files = splitList(row.photo_files || row.files);
    if (!files.length) return row;
    const urls = resolveFileUrls(manifest, folder, files);
    return { ...row, photo_files: urls.join(', ') };
  });

  const siteSheet = wb.Sheets['Site'];
  if (siteSheet) {
    const siteRows = XLSX.utils.sheet_to_json(siteSheet, { defval: '' });
    const bumped = siteRows.map((r) => {
      const key = String(r.field || r.Field || '').trim();
      if (key === 'cache_version') {
        const v = String(r.value ?? r.Value ?? '1.0.0');
        const parts = v.split('.').map(Number);
        parts[2] = (parts[2] || 0) + 1;
        return { ...r, value: parts.join('.') };
      }
      return r;
    });
    wb.Sheets['Site'] = XLSX.utils.json_to_sheet(bumped);
  }

  XLSX.writeFile(wb, excelPath);
  console.log(`✓ Updated site-data.xlsx (${total} sheet rows patched)`);
}

async function main() {
  loadEnv();

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const dryRun = process.argv.includes('--dry-run');

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing Cloudinary credentials.');
    console.error('Copy .env.example → .env and set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const manifest = loadManifest();
  manifest.cloudName = cloudName;

  const files = walkMedia(mediaRoot);
  if (!files.length) {
    console.log('No media files found in public/media/');
    process.exit(0);
  }

  console.log(`Found ${files.length} media file(s) in public/media/`);
  let uploaded = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const result = await uploadOne(file, manifest, { dryRun });
      if (result.skipped) skipped++;
      else uploaded++;
    } catch (err) {
      console.error(`  ✗ failed ${file.rel}:`, err.message || err);
    }
  }

  if (!dryRun) saveManifest(manifest);
  patchExcel(manifest);

  console.log(`\nDone — ${uploaded} uploaded, ${skipped} unchanged`);
  console.log('Run: npm run sync');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
