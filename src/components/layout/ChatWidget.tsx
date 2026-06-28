import { useState, useEffect, useCallback, useRef } from 'react';
import { getContactUrl, siteConfig } from '../../lib/utils';

interface Props {
  enabled: boolean;
  web3formsAccessKey?: string;
}

type ChatMessage = { role: 'bot' | 'user'; text: string; id: string };

const GREETING =
  "Hi — ask me anything about website redesign, data scraping, or custom software. I'll make sure Shubham gets your message.";

const MAX_MESSAGES = 5;

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

function loadSession() {
  try {
    const raw = sessionStorage.getItem('ss-chat-session');
    if (!raw) return null;
    return JSON.parse(raw) as { name: string; email: string; messageCount: number };
  } catch {
    return null;
  }
}

function saveSession(data: { name: string; email: string; messageCount: number }) {
  try {
    sessionStorage.setItem('ss-chat-session', JSON.stringify(data));
  } catch { /* ignore */ }
}

export default function ChatWidget({ enabled, web3formsAccessKey = '' }: Props) {
  const session = loadSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: GREETING, id: 'greeting' },
  ]);
  const [input, setInput] = useState('');
  const [name, setName] = useState(session?.name || '');
  const [email, setEmail] = useState(session?.email || '');
  const [sending, setSending] = useState(false);
  const [messageCount, setMessageCount] = useState(session?.messageCount || 0);
  const [hasContact, setHasContact] = useState(!!(session?.email));
  const bottomRef = useRef<HTMLDivElement>(null);
  const accessKey = String(web3formsAccessKey || import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || '').trim();

  const atLimit = messageCount >= MAX_MESSAGES;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    const openFromFaq = () => setOpen(true);
    window.addEventListener('ss-open-chat', openFromFaq);
    return () => window.removeEventListener('ss-open-chat', openFromFaq);
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    const visitorName = name.trim();
    const visitorEmail = email.trim();
    const page = window.location.pathname;

    if (!text || sending || atLimit) return;

    if (!visitorEmail) {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'Please add your email so Shubham can reply to you.', id: `bot-${Date.now()}` },
      ]);
      return;
    }

    const userMsg: ChatMessage = { role: 'user', text, id: `user-${Date.now()}` };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);
    setHasContact(true);

    const payload = { message: text, name: visitorName || 'Website visitor', email: visitorEmail, page };

    try {
      if (accessKey && (await sendViaWeb3Forms(accessKey, payload))) {
        const newCount = messageCount + 1;
        setMessageCount(newCount);
        saveSession({ name: visitorName, email: visitorEmail, messageCount: newCount });
        setMessages((m) => [
          ...m,
          {
            role: 'bot',
            text:
              newCount >= MAX_MESSAGES
                ? 'Got it — your message was sent. You can email Shubham directly for follow-ups.'
                : 'Got it — message sent! Feel free to send another question below.',
            id: `bot-${Date.now()}`,
          },
        ]);
        return;
      }

      window.location.href = getContactUrl({
        message: [
          'Hi Shubham,',
          '',
          text.trim(),
          '',
          `Name: ${visitorName}`,
          visitorEmail ? `Email: ${visitorEmail}` : '',
          `Page: ${page || '/'}`,
        ].filter(Boolean).join('\n'),
        intent: 'chat',
      });
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      saveSession({ name: visitorName, email: visitorEmail, messageCount: newCount });
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: 'Gmail is opening with your message pre-filled — click Send there to deliver it.',
          id: `bot-${Date.now()}`,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: `Something went wrong. Please email ${siteConfig.email} directly.`, id: `bot-${Date.now()}` },
      ]);
    } finally {
      setSending(false);
    }
  }, [input, sending, name, email, accessKey, messageCount, atLimit]);

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
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 ring-1 ring-accent/40">
                  <span className="text-sm font-semibold text-accent">SS</span>
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
            {messages.map((msg) => (
              <div
                key={msg.id}
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

          {!atLimit && (
            <div className="border-t border-champagne/60 bg-white/50 px-4 py-4 space-y-3">
              {!hasContact && (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="chat-input w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="chat-input w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}
              {hasContact && email && (
                <p className="text-[10px] text-muted">
                  Replying as <span className="font-medium text-charcoal">{email}</span>
                </p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Write your message here…"
                  className="chat-input min-w-0 flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  disabled={sending}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={sending || !input.trim() || !email.trim()}
                  className="shrink-0 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)' }}
                >
                  {sending ? '…' : 'Send'}
                </button>
              </div>
            </div>
          )}
          {atLimit && (
            <div className="border-t border-champagne/60 bg-white/50 px-4 py-4 text-center text-xs text-muted">
              Session limit reached.{' '}
              <a href="/#contact" className="font-medium text-charcoal underline">
                Contact form
              </a>{' '}
              for more questions.
            </div>
          )}
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-[90] flex h-14 w-14 items-center justify-center rounded-full text-ivory shadow-[0_8px_32px_rgba(15,23,42,0.35)] ring-1 ring-accent/30 transition-transform hover:scale-105"
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
