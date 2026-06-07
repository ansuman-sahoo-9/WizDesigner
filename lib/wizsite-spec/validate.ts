// Dependency-free structural validation for WizSiteSpecV2. (A zod schema could
// replace this later without changing call sites — same {ok, errors} contract.)

import type { WizSiteSpecV2, ErpType } from './types';

const ERP: ErpType[] = ['netsuite', 'quickbooks', 'sap_b1', 'dynamics', 'acumatica', 'shopify', 'bigcommerce', 'custom', 'none'];

export type ValidationResult = { ok: boolean; errors: string[] };

const isStr = (v: unknown) => typeof v === 'string';
const isBool = (v: unknown) => typeof v === 'boolean';
const isObj = (v: unknown) => typeof v === 'object' && v !== null;

export function validateWizSiteSpec(spec: unknown): ValidationResult {
  const errors: string[] = [];
  const req = (cond: boolean, msg: string) => { if (!cond) errors.push(msg); };

  if (!isObj(spec)) return { ok: false, errors: ['spec is not an object'] };
  const s = spec as Partial<WizSiteSpecV2>;

  // Top-level shape
  (['meta', 'brand', 'multiBrand', 'theme', 'navigation', 'pages', 'business', 'ai', 'infrastructure', 'imScope'] as const)
    .forEach((k) => req(isObj(s[k]), `missing/invalid: ${k}`));

  if (isObj(s.meta)) {
    req(s.meta!.schemaVersion === 'v2', 'meta.schemaVersion must be "v2"');
    req(isStr(s.meta!.siteId), 'meta.siteId must be a string');
    req(ERP.includes(s.meta!.erpType as ErpType), `meta.erpType invalid: ${String(s.meta!.erpType)}`);
  }
  if (isObj(s.theme)) {
    req(isObj(s.theme!.palette), 'theme.palette missing');
    req(isStr(s.theme!.palette?.primary), 'theme.palette.primary missing');
    req(['compact', 'comfortable', 'spacious'].includes(s.theme!.density), 'theme.density invalid');
  }
  if (isObj(s.business)) {
    req(isObj(s.business!.pricing), 'business.pricing missing');
    req(isBool(s.business!.pricing?.loginGated), 'business.pricing.loginGated must be boolean');
    req(Array.isArray(s.business!.customerGroups), 'business.customerGroups must be an array');
    req(ERP.includes(s.business!.erpIntegration?.type as ErpType), 'business.erpIntegration.type invalid');
  }
  if (isObj(s.pages)) {
    req(isObj(s.pages!.pdp?.gallery), 'pages.pdp.gallery missing');
    req(Array.isArray(s.pages!.pdp?.accordions), 'pages.pdp.accordions must be an array');
    req(Array.isArray(s.pages!.plp?.filters?.filters), 'pages.plp.filters.filters must be an array');
  }
  if (isObj(s.brand)) {
    req(Array.isArray(s.brand!.homepage?.sections), 'brand.homepage.sections must be an array');
  }
  if (isObj(s.multiBrand)) {
    req(isBool(s.multiBrand!.enabled), 'multiBrand.enabled must be boolean');
    req(Array.isArray(s.multiBrand!.brands), 'multiBrand.brands must be an array');
  }

  return { ok: errors.length === 0, errors };
}
