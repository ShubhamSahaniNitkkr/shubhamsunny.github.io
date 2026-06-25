import type { VercelRequest, VercelResponse } from './types';
import { isMailConfigured, sendOwnerEmail } from './_mail';

const ALLOWED_ORIGINS = new Set([
  'https://shubhamsunny.com',
  'https://www.shubhamsunny.com',
  'http://localhost:4321',
  'http://localhost:3000',
  'http://127.0.0.1:4321',
]);

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = String(req.headers.origin || '');
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isMailConfigured()) {
    return res.status(200).json({ ok: false, skipped: true });
  }

  try {
    const { page, referrer } = req.body || {};
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';

    await sendOwnerEmail({
      subject: '👀 Someone opened your website',
      text: [
        'New visit on shubhamsunny.com',
        '',
        `Page: ${String(page || '/')}`,
        `Referrer: ${String(referrer || 'direct')}`,
        `IP: ${ip}`,
        `Device: ${ua}`,
        `Time: ${new Date().toISOString()}`,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false });
  }
}
