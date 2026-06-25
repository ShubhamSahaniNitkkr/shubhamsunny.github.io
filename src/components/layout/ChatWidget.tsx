import { useState, useEffect, useCallback, useRef } from 'react';
import { getChatEmailUrl, siteConfig } from '../../lib/utils';

interface Props {
  enabled: boolean;
  web3formsAccessKey?: string;
}

type ChatMessage = { role: 'bot' | 'user'; text: string };

const GREETING =
  "Hi — ask me anything about website redesign, pricing, or timelines. I'll make sure Shubham gets your message.";

async function sendViaWeb3Forms(
  accessKey: string,
  payload: { name: string; email: string; message: string; page: string },
) {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Website chat — ${payload.name || 'Visitor'}`,
      name: payload.name || 'Website visitor',
      email: payload.email,
      message: [
        payload.message,
        '',
        `Page: ${payload.page || '/'}`,
        'Sent via website chat on shubhamsunny.com',
      ].join('\n'),
    }),
  });

  const data = await res.json().catch(() => ({}));
  return res.ok && data.success === true;
}

export default function ChatWidget({ enabled, web3formsAccessKey = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const accessKey = String(web3formsAccessKey || import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || '').trim();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    const visitorName = name.trim();
    const visitorEmail = email.trim();
    const page = window.location.pathname;

    if (!text || sending) return;

    if (!visitorEmail) {
      setMessages((m) => [...m, { role: 'bot', text: 'Please add your email so Shubham can reply to you.' }]);
      return;
    }

    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setSending(true);

    const payload = { message: text, name: visitorName || 'Website visitor', email: visitorEmail, page };

    try {
      if (accessKey && (await sendViaWeb3Forms(accessKey, payload))) {
        setSent(true);
        setMessages((m) => [
          ...m,
          { role: 'bot', text: 'Got it — your message was sent. Shubham typically replies within one business day.' },
        ]);
        return;
      }

      const gmailUrl = getChatEmailUrl(visitorName, visitorEmail, text, page);
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      setSent(true);
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: 'Gmail is opening with your message pre-filled — click Send there to deliver it to Shubham.',
        },
      ]);
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: `Something went wrong. Please email ${siteConfig.email} directly.` }]);
    } finally {
      setSending(false);
    }
  }, [input, sending, name, email, accessKey]);

  if (!enabled) return null;

  return (
    <>
      {open && (
        <div
          className="chat-panel fixed z-[90] flex flex-col overflow-hidden rounded-2xl border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          style={{
            bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))',
            right: 'max(0.75rem, env(safe-area-inset-right))',
            width: 'min(100vw - 1.5rem, 440px)',
            maxHeight: 'min(88vh, 680px)',
            background: 'linear-gradient(165deg, rgba(248,250,252,0.97) 0%, rgba(241,245,249,0.95) 100%)',
          }}
        >
          <div className="relative overflow-hidden px-5 py-4 text-ivory" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1e293b 50%, #0F172A 100%)' }}>
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-rose-gold/20 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-gold/20 ring-1 ring-rose-gold/40">
                  <span className="text-sm font-semibold text-rose-gold-light">SS</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Chat with Shubham</p>
                  <p className="flex items-center gap-1.5 text-[10px] text-ivory/60">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Typically replies within 24h
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1.5 text-ivory/70 transition hover:bg-white/10 hover:text-ivory" aria-label="Close chat">
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'ml-auto rounded-br-md bg-charcoal text-ivory'
                    : 'rounded-bl-md border border-champagne/80 bg-white text-charcoal'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {!sent && (
            <div className="border-t border-champagne/60 bg-white/50 px-4 py-4 space-y-3">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="chat-input w-full rounded-xl border border-champagne/80 bg-white px-3.5 py-3 text-sm shadow-inner outline-none transition focus:border-rose-gold/50 focus:ring-2 focus:ring-rose-gold/15"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="chat-input w-full rounded-xl border border-champagne/80 bg-white px-3.5 py-3 text-sm shadow-inner outline-none transition focus:border-rose-gold/50 focus:ring-2 focus:ring-rose-gold/15"
                />
              </div>
              <div>
                <label htmlFor="chat-message" className="mb-2 block text-xs font-semibold tracking-wide text-charcoal">
                  Tell me about your website
                </label>
                <textarea
                  id="chat-message"
                  name="message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={9}
                  placeholder="Share your business, current website URL, and what you want to improve..."
                  className="chat-input w-full resize-y rounded-xl border border-champagne/80 bg-white px-4 py-3 text-sm leading-relaxed shadow-inner outline-none transition focus:border-rose-gold/50 focus:ring-2 focus:ring-rose-gold/15"
                  disabled={sending}
                  required
                />
              </div>
              <button
                type="button"
                onClick={sendMessage}
                disabled={sending || !input.trim() || !email.trim()}
                className="w-full rounded-xl px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)' }}
              >
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </div>
          )}
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-[90] flex h-14 w-14 items-center justify-center rounded-full text-ivory shadow-[0_8px_32px_rgba(15,23,42,0.35)] ring-1 ring-rose-gold/30 transition-transform hover:scale-105"
          style={{
            bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))',
            right: 'max(0.75rem, env(safe-area-inset-right))',
            background: 'linear-gradient(135deg, #0F172A 0%, #1e293b 100%)',
          }}
          aria-label="Open chat"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </>
  );
}
