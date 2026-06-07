'use client';

import { useEffect, useRef, useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { interpret, type AssistantAction, type AssistantReply } from '@/lib/assistant';

type Msg = { role: 'user' | 'bot'; text: string; chips?: string[] };

const GREETING: Msg = {
  role: 'bot',
  text: "Hi, I'm Wiz — your design copilot. I can change variants, palette, fonts, personas and business rules, manage snapshots, and explain your current design. What would you like to do?",
  chips: ['Make it feel more luxe', 'What variants am I using?', 'Summarize my scope', 'Save a version'],
};

export function ChatAssistant({
  onPresent,
  onCompare,
  onExportSummary,
  onExportScope,
}: {
  onPresent: () => void;
  onCompare: () => void;
  onExportSummary: () => void;
  onExportScope: () => void;
}) {
  const design = useDesign();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const runAction = (a: AssistantAction) => {
    switch (a.kind) {
      case 'setVariant': design.setVariant(a.sectionId, a.variant); break;
      case 'persona': design.setPersona(a.persona); break;
      case 'palette': design.setField('palette', a.palette); break;
      case 'font': design.setField('font', a.font); break;
      case 'saveVersion': design.saveVersion(a.name); break;
      case 'loadVersion': design.loadVersion(a.id); break;
      case 'business': design.setBusiness(a.group as never, a.key, a.value); break;
      case 'present': onPresent(); break;
      case 'compare': onCompare(); break;
      case 'exportSummary': onExportSummary(); break;
      case 'exportScope': onExportScope(); break;
      case 'reset': design.reset(); break;
    }
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const reply: AssistantReply = interpret(text, {
      state: design.state,
      sections: design.sections,
      versions: design.versions,
      productCount: design.products.length,
      categoryCount: design.categories.length,
    });
    setMessages((m) => [...m, { role: 'user', text }, { role: 'bot', text: reply.text, chips: reply.chips }]);
    setInput('');
    if (reply.action) {
      // let the confirmation render before the app mutates (esp. present/compare overlays)
      setTimeout(() => runAction(reply.action!), 60);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Ask Wiz — your design assistant"
        className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-[12px] font-semibold transition-colors ${
          open ? 'bg-[var(--chrome-ink)] text-white' : 'bg-[var(--chrome-accent)] text-zinc-900 hover:brightness-95'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l1.9 4.6L18.5 8l-3.4 3 1 4.9L12 13.8 7.9 15.9l1-4.9L5.5 8l4.6-1.4L12 2z" />
        </svg>
        Ask Wiz
      </button>

      {open && (
        <div className="wd-fade fixed right-3 top-16 z-50 flex h-[560px] max-h-[calc(100vh-5rem)] w-[360px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl bg-[var(--chrome-panel)] shadow-2xl ring-1 ring-black/10">
          <div className="flex flex-none items-center justify-between border-b border-[var(--chrome-line)] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[var(--chrome-ink)] text-[var(--chrome-accent)]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l1.9 4.6L18.5 8l-3.4 3 1 4.9L12 13.8 7.9 15.9l1-4.9L5.5 8l4.6-1.4L12 2z" />
                </svg>
              </span>
              <div>
                <div className="text-[13px] font-semibold leading-none">Wiz Assistant</div>
                <div className="mt-0.5 text-[10px] text-[var(--chrome-muted)]">Design copilot · mocked for MVP</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-md p-1 text-[var(--chrome-muted)] hover:bg-[var(--chrome-bg)] hover:text-[var(--chrome-ink)]" aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <div className="wd-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
                <div
                  className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-[var(--chrome-ink)] text-white'
                      : 'rounded-bl-sm bg-[var(--chrome-bg)] text-[var(--chrome-ink)]'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'bot' && m.chips && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.chips.map((c) => (
                      <button
                        key={c}
                        onClick={() => send(c)}
                        className="rounded-full border border-[var(--chrome-line)] bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--chrome-ink)] hover:border-[var(--chrome-muted)]"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex flex-none items-center gap-2 border-t border-[var(--chrome-line)] p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Wiz or give a command…"
              className="flex-1 rounded-md border border-[var(--chrome-line)] bg-white px-3 py-2 text-[12.5px] outline-none focus:border-[var(--chrome-ink)]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="grid h-9 w-9 flex-none place-items-center rounded-md bg-[var(--chrome-ink)] text-white disabled:opacity-40"
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
