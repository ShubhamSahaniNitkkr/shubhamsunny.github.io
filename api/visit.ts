import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isMailConfigured, sendOwnerEmail } from './_mail';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
