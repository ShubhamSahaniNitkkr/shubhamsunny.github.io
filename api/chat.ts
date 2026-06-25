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
    return res.status(503).json({ error: 'Email not configured' });
  }

  try {
    const { message, name, email, page } = req.body || {};
    const text = String(message || '').trim();
    const visitor = String(name || 'Website visitor').trim();
    const visitorEmail = String(email || '').trim();
    const path = String(page || '').trim();

    if (!text) return res.status(400).json({ error: 'Message is required' });

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

    await sendOwnerEmail({
      subject: `💬 Website chat — ${visitor}`,
      text: [
        'New chat message from shubhamsunny.com',
        '',
        `Name: ${visitor}`,
        visitorEmail ? `Email: ${visitorEmail}` : 'Email: (not provided)',
        `Page: ${path || '/'}`,
        `IP: ${ip}`,
        '',
        'Message:',
        text,
      ].join('\n'),
      replyTo: visitorEmail || undefined,
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
