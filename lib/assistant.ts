// WizDesigner — "Wiz" assistant intent engine.
// Rule-based for the MVP (no LLM calls), but pure + swappable: interpret() takes
// the user's text + a read-only context snapshot and returns a reply that may
// carry an action the chat component executes against DesignContext. A real model
// could replace interpret() later without touching the UI.

import type { DesignState, Version, Variant, PersonaId } from './types';
import type { SectionDef } from './types';
import { variantLabel } from './industries';
import { PALETTES, FONTS, paletteById, fontById } from './themes';
import { PERSONA_META, availablePersonas } from './wizorder';
import { computeScope } from './exports';
import { money } from './format';

export type AssistantAction =
  | { kind: 'setVariant'; sectionId: string; variant: Variant }
  | { kind: 'persona'; persona: PersonaId }
  | { kind: 'palette'; palette: string }
  | { kind: 'font'; font: string }
  | { kind: 'saveVersion'; name?: string }
  | { kind: 'loadVersion'; id: string }
  | { kind: 'business'; group: string; key: string; value: unknown }
  | { kind: 'present' }
  | { kind: 'compare' }
  | { kind: 'exportSummary' }
  | { kind: 'exportScope' }
  | { kind: 'reset' };

export type AssistantReply = { text: string; action?: AssistantAction; chips?: string[] };

export type AssistantCtx = {
  state: DesignState;
  sections: SectionDef[];
  versions: Version[];
  productCount: number;
  categoryCount: number;
};

const SECTION_ALIASES: Record<string, string[]> = {
  header: ['header', 'nav', 'navigation', 'menu'],
  hero: ['hero', 'banner'],
  categories: ['categor', 'collections grid'],
  featured: ['featured', 'product grid', 'products section'],
  trade: ['trade', 'wholesale program'],
  testimonials: ['testimonial', 'review'],
  about: ['about', 'story'],
  pdp: ['pdp', 'product detail', 'product page', 'product-detail'],
  cart: ['cart', 'checkout', 'basket'],
  footer: ['footer'],
};

const PERSONA_KEYS: Record<string, PersonaId> = {
  guest: 'guest',
  dealer: 'dealer',
  distributor: 'distributor',
  retailer: 'retailer',
  retail: 'retailer',
  international: 'international',
};

// Common business toggles the assistant can flip directly.
const BIZ: Record<string, { group: string; key: string; label: string }> = {
  'login-gated': { group: 'pricing', key: 'loginGated', label: 'Login-gated pricing' },
  'login gated': { group: 'pricing', key: 'loginGated', label: 'Login-gated pricing' },
  'volume pricing': { group: 'pricing', key: 'volumePricing', label: 'Volume / tier pricing' },
  'tier pricing': { group: 'pricing', key: 'volumePricing', label: 'Volume / tier pricing' },
  'customer-specific': { group: 'pricing', key: 'customerSpecificPricing', label: 'Customer-specific pricing' },
  moq: { group: 'catalog', key: 'moqEnabled', label: 'MOQ enforcement' },
  'case pack': { group: 'catalog', key: 'casePacksEnabled', label: 'Case packs' },
  'custom modifier': { group: 'catalog', key: 'customModifiersEnabled', label: 'Custom modifiers' },
  imprint: { group: 'catalog', key: 'customModifiersEnabled', label: 'Custom modifiers' },
  'free shipping': { group: 'shipping', key: 'freeShippingEnabled', label: 'Free-shipping threshold' },
  amazon: { group: 'externalRetail', key: 'amazonLinksEnabled', label: 'Amazon buy links' },
  walmart: { group: 'externalRetail', key: 'walmartLinksEnabled', label: 'Walmart buy links' },
  'similar products': { group: 'aiFeatures', key: 'similarProductsEnabled', label: 'Similar products' },
  'announcement bar': { group: 'marketing', key: 'announcementBarEnabled', label: 'Announcement bar' },
};

const DEFAULT_CHIPS = ['What variants am I using?', 'Summarize my scope', 'Save a version', 'Preview as Dealer'];

function has(t: string, ...words: string[]) {
  return words.some((w) => t.includes(w));
}

function findSection(t: string, sections: SectionDef[]): SectionDef | undefined {
  for (const s of sections) {
    const aliases = SECTION_ALIASES[s.id] ?? [s.id];
    if (aliases.some((a) => t.includes(a))) return s;
  }
  return undefined;
}

function findVariant(t: string, sectionId: string): Variant | undefined {
  // explicit letter, e.g. "variant c" or "to c"
  const m = t.match(/\b(?:variant\s+|option\s+|to\s+|set\s+)?([abcd])\b/);
  // match by label keyword (e.g. "cinematic", "split", "bento")
  for (const v of ['A', 'B', 'C', 'D'] as Variant[]) {
    const label = variantLabel(sectionId, v).toLowerCase();
    const kw = label.split(/[\s·-]+/).filter((w) => w.length > 3);
    if (kw.some((w) => t.includes(w))) return v;
  }
  if (m) return m[1].toUpperCase() as Variant;
  return undefined;
}

function parseVersionName(t: string): string | undefined {
  const m = t.match(/(?:named|called|as)\s+["']?([\w\s-]{2,40})["']?$/);
  return m ? m[1].trim() : undefined;
}

function findVersion(t: string, versions: Version[]): Version | undefined {
  if (!versions.length) return undefined;
  if (/\b(last|latest|most recent|newest)\b/.test(t)) return versions[versions.length - 1];
  // by exact-ish name
  const byName = versions.find((v) => t.includes(v.name.toLowerCase()));
  if (byName) return byName;
  // by trailing number, e.g. "load version 2"
  const num = t.match(/\b(\d{1,3})\b/);
  if (num) return versions[parseInt(num[1], 10) - 1];
  return undefined;
}

function describeSections(ctx: AssistantCtx): string {
  const lines = ctx.sections
    .filter((s) => s.enabled)
    .map((s) => {
      const v = ctx.state.variants[s.id] ?? s.defaultVariant;
      return s.id === 'about' ? `• ${s.name} — default` : `• ${s.name} — ${v} (${variantLabel(s.id, v)})`;
    });
  return `You have ${lines.length} sections enabled:\n${lines.join('\n')}`;
}

function describeVersions(ctx: AssistantCtx): string {
  const vs = ctx.versions;
  if (!vs.length) return "You haven't saved any versions yet. Say “save a version” and I'll capture the current design. You can keep as many as you like.";
  return (
    `You have ${vs.length} saved ${vs.length === 1 ? 'version' : 'versions'}:\n` +
    vs
      .map((v) => {
        const pal = v.palette === 'custom' ? 'Custom' : paletteById(v.palette).name;
        return `• ${v.name} — ${v.brandName} · ${pal} · ${fontById(v.font).display}`;
      })
      .join('\n')
  );
}

function describeScope(ctx: AssistantCtx): string {
  const scope = computeScope(ctx.state, ctx.sections, { products: ctx.productCount, categories: ctx.categoryCount });
  return [
    `Implementation scope — complexity ${scope.complexity}.`,
    `• ~${scope.estimated_days}–${scope.estimated_days + 4} days to launch`,
    `• Est. ACV add-on ${money(scope.estimated_acv)}`,
    `• Integrations: ${scope.integrations.join(', ')}`,
    'Say “export scope” for the full IM blueprint.',
  ].join('\n');
}

function helpText(): string {
  return [
    "I'm Wiz — I help you design and I can change things for you. Try:",
    '• “Set the hero to cinematic” or “make the cart variant D”',
    '• “What variants am I using?” / “which snapshots are saved?”',
    '• “Save a version” / “load the latest version” / “compare”',
    '• “Preview as Dealer” / “use the Industrial palette”',
    '• “Turn on volume pricing” / “disable login-gated pricing”',
    '• “Summarize my scope” / “export scope” / “present”',
  ].join('\n');
}

// --- main entry ------------------------------------------------------------

export function interpret(input: string, ctx: AssistantCtx): AssistantReply {
  const t = input.toLowerCase().trim();
  if (!t) return { text: helpText(), chips: DEFAULT_CHIPS };

  // Help
  if (has(t, 'what can you', 'help', 'commands', 'how do i use', 'who are you')) {
    return { text: helpText(), chips: DEFAULT_CHIPS };
  }

  const asking = has(t, 'what', 'which', 'list', 'show', 'how many', '?');

  // Answer: variants / sections in use
  if (asking && has(t, 'variant', 'section', 'using', 'component')) {
    return { text: describeSections(ctx), chips: ['Set hero to cinematic', 'Summarize my scope'] };
  }
  // Answer: versions
  if (asking && has(t, 'snapshot', 'version', 'saved', 'history')) {
    return { text: describeVersions(ctx), chips: ['Save a version', 'Compare versions'] };
  }
  // Answer: scope / complexity / estimate
  if (has(t, 'scope', 'complexity', 'estimate', 'how long', 'acv', 'cost', 'blueprint') && !has(t, 'export')) {
    return { text: describeScope(ctx), chips: ['Export scope', 'Export summary'] };
  }

  // Actions: present / compare
  if (has(t, 'present', 'full screen', 'fullscreen', 'screen share')) {
    return { text: 'Opening the presentation in a new tab.', action: { kind: 'present' } };
  }
  if (has(t, 'compare')) {
    if (ctx.versions.length < 2) return { text: 'You need at least two saved versions to compare. Save another first.', chips: ['Save a version'] };
    return { text: 'Opening Compare mode.', action: { kind: 'compare' } };
  }

  // Exports
  if (has(t, 'export scope', 'implementation', 'im scope', 'hand off', 'handoff')) {
    return { text: 'Opening the implementation scope export.', action: { kind: 'exportScope' } };
  }
  if (has(t, 'export summary', 'export', 'recap')) {
    return { text: 'Opening the design summary export.', action: { kind: 'exportSummary' } };
  }

  // Versions: save / load
  if (has(t, 'save', 'pin', 'snapshot') && has(t, 'version', 'snapshot', 'design', 'this', 'pin')) {
    const name = parseVersionName(t);
    const labelName = name ?? `Version ${ctx.versions.length + 1}`;
    return { text: `Saved the current design as “${labelName}”. You now have ${ctx.versions.length + 1}.`, action: { kind: 'saveVersion', name } };
  }
  if (has(t, 'load', 'restore', 'switch to', 'go back to') && has(t, 'version', 'snapshot', 'latest', 'last')) {
    const v = findVersion(t, ctx.versions);
    if (v) return { text: `Loaded “${v.name}”.`, action: { kind: 'loadVersion', id: v.id } };
    return { text: "I couldn't find that version. Try “which versions are saved?”", chips: ['Which versions are saved?'] };
  }

  // Persona
  if (has(t, 'preview as', 'persona', 'view as', 'as a', 'as the') || (asking === false && Object.keys(PERSONA_KEYS).some((k) => t.includes(k)))) {
    const key = Object.keys(PERSONA_KEYS).find((k) => t.includes(k));
    if (key) {
      const persona = PERSONA_KEYS[key];
      if (!availablePersonas(ctx.state.business).includes(persona)) {
        return { text: `${PERSONA_META[persona].label} isn't an available group. Add it under Customer tiers in Business config first.` };
      }
      return { text: `Previewing the storefront as ${PERSONA_META[persona].label}.`, action: { kind: 'persona', persona } };
    }
  }

  // Palette
  if (has(t, 'palette', 'colour', 'color', 'theme') || PALETTES.some((p) => t.includes(p.id))) {
    const pal = PALETTES.find((p) => t.includes(p.id) || t.includes(p.name.toLowerCase()));
    if (pal) return { text: `Applied the ${pal.name} palette (${pal.blurb}).`, action: { kind: 'palette', palette: pal.id } };
    if (has(t, 'palette', 'theme')) return { text: `Available palettes: ${PALETTES.map((p) => p.name).join(', ')}. Which one?`, chips: PALETTES.slice(0, 4).map((p) => `Use the ${p.name} palette`) };
  }

  // Font
  if (has(t, 'font', 'typeface', 'type')) {
    const f = FONTS.find((x) => t.includes(x.name.toLowerCase()) || t.includes(x.display.toLowerCase()));
    if (f) return { text: `Switched the font pairing to ${f.name} (${f.display} / ${f.body}).`, action: { kind: 'font', font: f.id } };
    return { text: `Font pairings: ${FONTS.map((x) => x.name).join(', ')}. Which one?` };
  }

  // Set a section variant
  const section = findSection(t, ctx.sections);
  if (section && has(t, 'set', 'change', 'switch', 'make', 'use', 'variant', 'try', 'show')) {
    if (section.id === 'about') return { text: 'About is single-variant in the MVP — nothing to switch there.' };
    const v = findVariant(t, section.id);
    if (v) {
      return {
        text: `Done — ${section.name} is now Variant ${v} (${variantLabel(section.id, v)}).`,
        action: { kind: 'setVariant', sectionId: section.id, variant: v },
      };
    }
    const opts = (['A', 'B', 'C', 'D'] as Variant[]).map((x) => `${x} ${variantLabel(section.id, x)}`).join(', ');
    return { text: `Which variant for ${section.name}? Options: ${opts}.`, chips: (['A', 'B', 'C', 'D'] as Variant[]).map((x) => `Set ${section.id} to ${x}`) };
  }

  // Business toggles
  const bizKey = Object.keys(BIZ).find((k) => t.includes(k));
  if (bizKey) {
    const { group, key, label } = BIZ[bizKey];
    const turnOff = has(t, 'disable', 'turn off', 'remove', 'hide', 'no ', "don't", 'off');
    const value = !turnOff;
    return { text: `${value ? 'Enabled' : 'Disabled'} ${label}.`, action: { kind: 'business', group, key, value } };
  }

  // Reset
  if (has(t, 'reset', 'start over', 'clear everything')) {
    return { text: 'Reset to the default design. (Your snapshots are kept.)', action: { kind: 'reset' } };
  }

  // Fallback
  return {
    text: "I didn't catch a specific request. I can change variants, palette, font, personas, business rules, snapshots, and exports — or answer questions about your current design.",
    chips: DEFAULT_CHIPS,
  };
}
