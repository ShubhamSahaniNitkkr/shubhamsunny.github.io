#!/usr/bin/env node
/** Download portfolio cover images from the web and append rows to site-data.xlsx */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const media = path.join(root, 'public', 'media');

const downloads = [
  ['portfolio/boutique-hotel/cover.jpg', 'https://picsum.photos/seed/hotel-web/1400/900'],
  ['portfolio/fitness-studio/cover.jpg', 'https://picsum.photos/seed/fitness-web/1400/900'],
  ['portfolio/real-estate/cover.jpg', 'https://picsum.photos/seed/realestate-web/1400/900'],
  ['portfolio/medical-clinic/cover.jpg', 'https://picsum.photos/seed/medical-web/1400/900'],
  ['portfolio/law-firm/cover.jpg', 'https://picsum.photos/seed/lawfirm-web/1400/900'],
  ['portfolio/fashion-store/cover.jpg', 'https://picsum.photos/seed/fashion-web/1400/900'],
];

for (const [rel, url] of downloads) {
  const dest = path.join(media, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${rel}`);
}

const excelPath = path.join(root, 'site-data.xlsx');
if (!fs.existsSync(excelPath)) {
  console.log('No site-data.xlsx — images saved only');
  process.exit(0);
}

const wb = XLSX.readFile(excelPath);
const newProjects = [
  { look_id: 'boutique-hotel', title: 'Boutique Hotel Booking', category: 'hospitality', folder: 'boutique-hotel', cover_file: 'cover.jpg', client_industry: 'Hospitality', outcome: 'Online bookings up 52% with a mobile-first reservation flow', live_url: '', highlights: 'Room gallery|Instant booking|Multi-language support', bento: 'standard' },
  { look_id: 'fitness-studio', title: 'Fitness Studio Website', category: 'local-business', folder: 'fitness-studio', cover_file: 'cover.jpg', client_industry: 'Health & Fitness', outcome: 'Class sign-ups doubled after launch', live_url: '', highlights: 'Class schedules|Trainer profiles|Membership plans', bento: 'tall' },
  { look_id: 'real-estate', title: 'Real Estate Listing Portal', category: 'professional-services', folder: 'real-estate', cover_file: 'cover.jpg', client_industry: 'Real Estate', outcome: 'Property inquiries increased 38% in 60 days', live_url: '', highlights: 'Map search|Virtual tours|Lead capture forms', bento: 'wide' },
  { look_id: 'medical-clinic', title: 'Medical Clinic Portal', category: 'healthcare', folder: 'medical-clinic', cover_file: 'cover.jpg', client_industry: 'Healthcare', outcome: 'Patient appointment requests up 45%', live_url: '', highlights: 'Doctor profiles|Online appointments|Service pages', bento: 'standard' },
  { look_id: 'law-firm', title: 'Law Firm Website', category: 'professional-services', folder: 'law-firm', cover_file: 'cover.jpg', client_industry: 'Legal', outcome: 'Consultation requests grew 33% post-redesign', live_url: '', highlights: 'Practice areas|Attorney bios|Secure contact forms', bento: 'standard' },
  { look_id: 'fashion-store', title: 'Fashion E-Commerce Store', category: 'ecommerce', folder: 'fashion-store', cover_file: 'cover.jpg', client_industry: 'Retail', outcome: 'Mobile sales increased 61% with faster checkout', live_url: '', highlights: 'Product catalog|Wishlist|Stripe checkout', bento: 'tall' },
];

const portRows = XLSX.utils.sheet_to_json(wb.Sheets.Portfolio, { defval: '' });
const existing = new Set(portRows.map((r) => String(r.look_id || r.id).trim()));
for (const p of newProjects) {
  if (!existing.has(p.look_id)) portRows.push(p);
}
wb.Sheets.Portfolio = XLSX.utils.json_to_sheet(portRows);
XLSX.writeFile(wb, excelPath);
console.log('✓ Excel updated');
