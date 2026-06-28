import { useState, useEffect, useLayoutEffect } from 'react';
import { getContactFormEmailUrl } from '../../lib/utils';
import {
  applyContactPrefillToDom,
  bootContactPrefill,
  readCachedContactPrefill,
} from '../../lib/contact-prefill';

interface Props {
  web3formsAccessKey?: string;
}

export default function ContactForm({ web3formsAccessKey = '' }: Props) {
  const initial = readCachedContactPrefill();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(initial.service);
  const [message, setMessage] = useState(initial.message);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'gmail' | 'error'>('idle');

  const accessKey = String(web3formsAccessKey || import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || '').trim();

  useLayoutEffect(() => {
    const applied = applyContactPrefillToDom();
    if (applied?.service) setService(applied.service);
    if (applied?.message) setMessage(applied.message);
  }, []);

  useEffect(() => {
    const syncPrefill = () => {
      bootContactPrefill();
      const applied = readCachedContactPrefill();
      if (applied.service) setService(applied.service);
      if (applied.message) setMessage(applied.message);
    };

    syncPrefill();
    window.addEventListener('hashchange', syncPrefill);
    window.addEventListener('popstate', syncPrefill);
    window.addEventListener('pageshow', syncPrefill);
    window.addEventListener('ss-prefill-contact', syncPrefill);
    return () => {
      window.removeEventListener('hashchange', syncPrefill);
      window.removeEventListener('popstate', syncPrefill);
      window.removeEventListener('pageshow', syncPrefill);
      window.removeEventListener('ss-prefill-contact', syncPrefill);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending || !email.trim() || !message.trim()) return;
    setSending(true);
    setStatus('idle');

    const payload = { name, email, phone, service, message };

    try {
      if (accessKey) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `Contact — ${name || 'Visitor'}`,
            name: name || 'Website visitor',
            email: payload.email,
            phone: payload.phone,
            service: payload.service || 'General',
            message: [payload.message, '', `Service: ${payload.service || 'Not specified'}`].join('\n'),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          setStatus('success');
          setName('');
          setEmail('');
          setPhone('');
          setService('');
          setMessage('');
          setSending(false);
          return;
        }
      }

      const gmailUrl = getContactFormEmailUrl(name, email, phone, service, message);
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      setStatus('gmail');
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="form-field">
          <label htmlFor="contact-name" className="form-label">Full name</label>
          <input id="contact-name" type="text" name="name" placeholder="John Smith" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
        </div>
        <div className="form-field">
          <label htmlFor="contact-email" className="form-label">Email address *</label>
          <input id="contact-email" type="email" name="email" placeholder="john@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="form-field">
          <label htmlFor="contact-phone" className="form-label">Phone number</label>
          <input id="contact-phone" type="tel" name="phone" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" />
        </div>
        <div className="form-field">
          <label htmlFor="contact-service" className="form-label">Service interest</label>
          <select id="contact-service" name="service" value={service} onChange={(e) => setService(e.target.value)} className="form-input">
            <option value="">Select a service…</option>
            <option value="Website Modernization">Website Modernization</option>
            <option value="Data Scraping">Data Scraping</option>
            <option value="Custom Software">Custom Software</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="contact-message" className="form-label">Tell me about your project *</label>
        <textarea id="contact-message" name="message" placeholder="Describe what you need — your current website, goals, timeline…" value={message} onChange={(e) => setMessage(e.target.value)} required rows={10} className="form-input resize-y" />
      </div>
      <button type="submit" disabled={sending || !email.trim() || !message.trim()} className="btn-accent w-full disabled:opacity-50">
        {sending ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'success' && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">Message sent — we&apos;ll reply within one business day.</p>
      )}
      {status === 'gmail' && (
        <p className="rounded-lg bg-blue-50 px-4 py-3 text-center text-sm text-blue-700">
          Could not send automatically — please try again or use the contact form fields above.
        </p>
      )}
      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          Something went wrong. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
