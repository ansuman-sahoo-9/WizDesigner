// WizSiteSpec V2 — canonical schema package (Sprint 1).
// Single source of truth: panels write to it, the preview reads from it, the
// IM Scope export serializes it. Introduced additively; the app migrates onto
// it incrementally in later sprints via the useWizSiteSpec adapter.

export * from './types';
export { defaultWizSiteSpec } from './defaults';
export { migrateV1ToV2 } from './migrate';
export { validateWizSiteSpec, type ValidationResult } from './validate';
