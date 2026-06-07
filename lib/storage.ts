// WizDesigner — localStorage helpers + session id.
// localStorage is the synchronous fallback tier; the sheet is primary but async.

import type { DesignState, Version, Product, Category, ImageAsset } from './types';

const STATE_KEY = 'wizdesigner.state';
const VERSION_KEY = 'wizdesigner.versions';
const CATALOG_KEY = 'wizdesigner.catalog';
const IMAGES_KEY = 'wizdesigner.images';
const SESSION_KEY = 'wizdesigner.sessionId';

export function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'sess_server';
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'sess_' + uuid().slice(0, 8);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function loadState(): DesignState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as DesignState) : null;
  } catch {
    return null;
  }
}

export function saveState(state: DesignState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    /* quota / privacy mode — ignore */
  }
}

export function loadVersions(): Version[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VERSION_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Version[]) : [];
  } catch {
    return [];
  }
}

export function saveVersions(versions: Version[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VERSION_KEY, JSON.stringify(versions));
  } catch {
    /* ignore */
  }
}

// --- Catalog (user-edited products + categories override fallback/sheet) ----

export type StoredCatalog = { products: Product[]; categories: Category[] };

export function loadCatalog(): StoredCatalog | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    return Array.isArray(c?.products) ? c : null;
  } catch {
    return null;
  }
}

export function saveCatalog(c: StoredCatalog): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}

export function clearCatalog(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CATALOG_KEY);
  } catch {
    /* ignore */
  }
}

// --- Image asset library ----------------------------------------------------

export function loadImages(): ImageAsset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(IMAGES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as ImageAsset[]) : [];
  } catch {
    return [];
  }
}

export function saveImages(list: ImageAsset[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false; // likely quota — caller keeps them in memory for the session
  }
}
