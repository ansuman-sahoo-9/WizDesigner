import type { ComponentType } from 'react';
import type { Variant } from '@/lib/types';
import type { SectionProps } from './_shared';
import { Header } from './Header';
import { Hero } from './Hero';
import { Categories } from './Categories';
import { Featured } from './Featured';
import { Trade } from './Trade';
import { Testimonials } from './Testimonials';
import { About } from './About';
import { PDPPreview } from './PDPPreview';
import { CartPreview } from './CartPreview';
import { Footer } from './Footer';

// Maps a Section Registry id to its component. Unknown ids render nothing,
// so adding a row in the sheet that has no component is harmless.
export const SECTION_COMPONENTS: Record<string, ComponentType<SectionProps>> = {
  header: Header,
  hero: Hero,
  categories: Categories,
  featured: Featured,
  trade: Trade,
  testimonials: Testimonials,
  about: About,
  pdp: PDPPreview,
  cart: CartPreview,
  footer: Footer,
};

// Which variants each section actually offers (About is single-variant for MVP).
export const SECTION_VARIANTS: Record<string, Variant[]> = {
  about: ['A'],
};

export function availableVariants(sectionId: string): Variant[] {
  return SECTION_VARIANTS[sectionId] ?? ['A', 'B', 'C', 'D'];
}
