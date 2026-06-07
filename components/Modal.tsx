'use client';

import { useEffect, type ReactNode } from 'react';

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="wd-fade relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-[var(--chrome-panel)] shadow-2xl ring-1 ring-black/10">
        <div className="flex items-start justify-between border-b border-[var(--chrome-line)] px-6 py-4">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12px] text-[var(--chrome-muted)]">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[var(--chrome-muted)] hover:bg-[var(--chrome-bg)] hover:text-[var(--chrome-ink)]"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto wd-scroll px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-[var(--chrome-line)] px-6 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-[var(--chrome-line)] px-3.5 py-2 text-[12px] font-medium hover:border-[var(--chrome-muted)]"
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-[var(--chrome-ink)] px-3.5 py-2 text-[12px] font-semibold text-white hover:opacity-90"
    >
      {children}
    </button>
  );
}
