'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePresentState } from '@/lib/present/usePresentState';
import { createToast } from '@/lib/present/toasts';
import { PresentHeader } from '../layout/PresentHeader';
import { PresentFooter } from '../layout/PresentFooter';
import { Container, PLink, px } from '../ui';

type Mode = 'login' | 'signup' | 'activation';

const COPY: Record<Mode, { title: string; cta: string; alt: string; altHref: string; altLabel: string }> = {
  login: { title: 'Trade Login', cta: 'Sign In', alt: "Don't have an account?", altHref: '/signup', altLabel: 'Apply for a trade account' },
  signup: { title: 'Apply for a Trade Account', cta: 'Submit Application', alt: 'Already approved?', altHref: '/login', altLabel: 'Sign in' },
  activation: { title: 'Activate Your Account', cta: 'Activate Account', alt: 'Need help?', altHref: '/pages/contact', altLabel: 'Contact us' },
};

export function AuthScreen({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { dispatch } = usePresentState();
  const c = COPY[mode];
  const [company, setCompany] = useState('');

  const submit = () => {
    dispatch({ type: 'SET_AUTH', isLoggedIn: true, persona: 'dealer', userName: 'buyer', companyName: company || 'Foothill Mercantile' });
    dispatch({ type: 'SHOW_TOAST', toast: createToast(mode === 'login' ? 'Welcome back!' : mode === 'signup' ? 'Application submitted — you now have trade access.' : 'Account activated!') });
    router.push(px('/'));
  };

  return (
    <>
      <PresentHeader />
      <Container className="grid max-w-md gap-4 py-16">
        <h1 className="sf-display text-2xl font-semibold">{c.title}</h1>
        {mode !== 'login' && <Input label="Company name" value={company} onChange={setCompany} />}
        <Input label="Email" value="" placeholder="you@store.com" />
        {mode === 'signup' && <Input label="Phone" value="" placeholder="(555) 555-5555" />}
        {mode !== 'signup' && <Input label="Password" value="" type="password" placeholder="••••••••" />}
        <button onClick={submit} className="mt-2 w-full py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>{c.cta}</button>
        <div className="text-center text-[12px]" style={{ color: 'var(--sf-muted)' }}>{c.alt} <PLink href={c.altHref} className="font-medium underline">{c.altLabel}</PLink></div>
      </Container>
      <PresentFooter />
    </>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange?: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label>
      <span className="mb-1 block text-[11px] uppercase tracking-wide" style={{ color: 'var(--sf-soft)' }}>{label}</span>
      <input type={type} defaultValue={value} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-[14px] outline-none focus:border-[var(--sf-ink)]" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-surface)' }} />
    </label>
  );
}
