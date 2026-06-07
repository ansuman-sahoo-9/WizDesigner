'use client';

// Adapter: exposes the canonical WizSiteSpecV2 derived from the live V1 state.
// Read-only in Sprint 1 (the app still runs on DesignContext). Later sprints
// migrate panels/preview/export to read & write this spec directly.

import { useMemo } from 'react';
import { useDesign } from './DesignContext';
import { migrateV1ToV2, type WizSiteSpecV2 } from './wizsite-spec';

export function useWizSiteSpec(): WizSiteSpecV2 {
  const { state } = useDesign();
  return useMemo(() => migrateV1ToV2(state), [state]);
}
