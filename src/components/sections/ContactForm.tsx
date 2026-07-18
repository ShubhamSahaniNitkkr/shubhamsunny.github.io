import { useState } from 'react';
import { getContactFormEmailUrl } from '../../lib/utils';

interface Props {
  web3formsAccessKey?: string;
}

export default function ContactForm({ web3formsAccessKey = '' }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'gmail' | 'error'>('idle');

  const accessKey = String(web3formsAccessKey || import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || '').trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending || !email.trim() || !message.trim()) return;
    setSending(true);
    setStatus('idle');

    try {
      if (accessKey) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `Portfolio inquiry — ${name || 'Visitor'}`,
            name: name || 'Website visitor',
            email,
            phone,
            message: [message, '', company ? `Company / Role: ${company}` : ''].filter(Boolean).join('\n'),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          setStatus('success');
          setName('');
          setEmail('');
          setPhone('');
          setCompany('');
          setMessage('');
          return;
        }
      }
      window.open(getContactFormEmailUrl(name, email, phone, company, message), '_blank');
      setStatus('gmail');
    } catch {
      window.open(getContactFormEmailUrl(name, email, phone, company, message), '_blank');
      setStatus('gmail');
    } finally {
      setSending(false);
    }
  }

  const field =
    'w-full rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-charcoal)] outline-none transition focus:border-[var(--color-navy)] focus:ring-2 focus:ring-[var(--color-navy)]/15';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold text-[var(--color-navy)]">Name</span>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold text-[var(--color-navy)]">Email *</span>
          <input
            className={field}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold text-[var(--color-navy)]">Phone</span>
          <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold text-[var(--color-navy)]">Company / Role</span>
          <input
            className={field}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Acme · Senior Frontend"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold text-[var(--color-navy)]">Message *</span>
        <textarea
          className={`${field} min-h-[120px] resize-y`}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about the role or what you'd like to discuss…"
        />
      </label>
      <button type="submit" className="btn-accent w-full sm:w-auto" disabled={sending}>
        {sending ? 'Sending…' : 'Send message'}
      </button>
      {status === 'success' && (
        <p className="text-sm font-medium text-emerald-700">Thanks — your message was sent.</p>
      )}
      {status === 'gmail' && (
        <p className="text-sm text-[var(--color-muted)]">Opened your email client as a fallback. You can send from there.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please email me directly.</p>
      )}
    </form>
  );
}
