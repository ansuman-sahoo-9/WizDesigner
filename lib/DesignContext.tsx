'use client';

// WizDesigner — global design state.
// React Context + useReducer. Persistence is two-tier:
//   1. React state updates instantly
//   2. localStorage write immediately (sync)
//   3. debounced (500ms) diff-based write to the "Design Decisions" sheet tab
// Boot loads the Section Registry first (drives what renders), then presets,
// products, categories — each with a fallback when the sheet is unavailable.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  DesignState,
  Version,
  Variant,
  Density,
  LogoStyle,
  CustomColors,
  SectionDef,
  Product,
  Category,
  ImageAsset,
  IndustryPreset,
  WizOrderSimulation,
  PersonaId,
  BrandEntry,
} from './types';
import { DEFAULT_BUSINESS, normalizeBusiness, availablePersonas } from './wizorder';
import { resolveBrands, withActiveBrand, resizeBrands, setBrandNameIn, updateBrandIn, reorderBrand as reorderBrandIn, removeBrandFrom, brandFromState } from './brands';
import type { BrandEntry as BrandEntryT } from './types';
import {
  SECTION_REGISTRY,
  INDUSTRY_PRESETS,
  DEFAULT_PRODUCTS,
  DEFAULT_CATEGORIES,
  presetForIndustry,
} from './industries';
import * as Sheet from './SheetService';
import {
  getSessionId,
  loadState,
  saveState,
  loadVersions,
  saveVersions,
  loadCatalog,
  saveCatalog,
  clearCatalog,
  loadImages,
  saveImages,
  uuid,
} from './storage';
import { categoriesFromProducts } from './catalog';

// ---------------------------------------------------------------------------
// Default state
// ---------------------------------------------------------------------------

function variantsFromRegistry(sections: SectionDef[]): Record<string, Variant> {
  const v: Record<string, Variant> = {};
  sections.forEach((s) => (v[s.id] = s.defaultVariant));
  return v;
}

function makeDefaultState(
  sections: SectionDef[],
  presets: IndustryPreset[],
): DesignState {
  const variants = variantsFromRegistry(sections);
  const preset = presets.find((p) => p.industry === 'Furniture') ?? presets[0];
  if (preset) {
    variants.hero = preset.defaultHeroVariant;
    variants.categories = preset.defaultCategoryVariant;
    variants.featured = preset.defaultProductVariant;
  }
  return {
    sessionId: getSessionId(),
    brandName: 'BLANCA & CO.',
    logoUrl: '',
    industry: preset?.industry ?? 'Furniture',
    palette: preset?.defaultPalette ?? 'heritage',
    font: 'heritage-serif',
    density: 'comfortable',
    logoStyle: 'wordmark',
    variants,
    mockIntegrations: {},
    business: DEFAULT_BUSINESS,
    persona: 'guest',
    brands: [
      { id: 'brand_1', name: 'BLANCA & CO.', palette: preset?.defaultPalette ?? 'heritage', font: 'heritage-serif', logoStyle: 'wordmark', logoUrl: '', heroVariant: preset?.defaultHeroVariant ?? 'B' },
    ],
    activeBrandId: 'brand_1',
    brandSwitcherStyle: 'pill',
  };
}

// Ensure brands/activeBrandId exist + are consistent (older persisted state).
function normalizeBrands(state: DesignState): DesignState {
  const brands = state.brands && state.brands.length ? state.brands : [brandFromState({ ...state, activeBrandId: state.activeBrandId ?? 'brand_1' })];
  const activeBrandId = brands.some((b) => b.id === state.activeBrandId) ? state.activeBrandId : brands[0].id;
  return { ...state, brands, activeBrandId };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type Action =
  | { type: 'SET_FIELD'; key: keyof DesignState; value: unknown }
  | { type: 'SET_VARIANT'; sectionId: string; variant: Variant }
  | { type: 'SET_CUSTOM_COLORS'; colors: CustomColors }
  | { type: 'APPLY_INDUSTRY'; preset: IndustryPreset }
  | { type: 'TOGGLE_INTEGRATION'; id: string; value: boolean }
  | { type: 'SET_BUSINESS'; group: keyof WizOrderSimulation; key: string; value: unknown }
  | { type: 'SET_PERSONA'; persona: PersonaId }
  | { type: 'SET_BRAND_COUNT'; count: number; newId: () => string }
  | { type: 'SET_ACTIVE_BRAND'; id: string }
  | { type: 'SET_BRAND_NAME'; id: string; name: string }
  | { type: 'UPDATE_BRAND'; id: string; patch: Partial<BrandEntryT> }
  | { type: 'REORDER_BRAND'; id: string; dir: 'up' | 'down' }
  | { type: 'REMOVE_BRAND'; id: string }
  | { type: 'REPLACE'; state: DesignState }
  | { type: 'HYDRATE'; state: DesignState }
  | { type: 'SYNC_SECTIONS'; sections: SectionDef[] };

// Keep the active persona valid for the current customer groups.
function clampPersona(state: DesignState): DesignState {
  const allowed = availablePersonas(state.business);
  return allowed.includes(state.persona) ? state : { ...state, persona: 'guest' };
}

function reducer(state: DesignState, action: Action): DesignState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value };
    case 'SET_VARIANT':
      return {
        ...state,
        variants: { ...state.variants, [action.sectionId]: action.variant },
      };
    case 'SET_CUSTOM_COLORS':
      return { ...state, palette: 'custom', customColors: action.colors };
    case 'APPLY_INDUSTRY':
      return {
        ...state,
        industry: action.preset.industry,
        palette: action.preset.defaultPalette,
        variants: {
          ...state.variants,
          hero: action.preset.defaultHeroVariant,
          categories: action.preset.defaultCategoryVariant,
          featured: action.preset.defaultProductVariant,
        },
      };
    case 'TOGGLE_INTEGRATION':
      return {
        ...state,
        mockIntegrations: { ...state.mockIntegrations, [action.id]: action.value },
      };
    case 'SET_BUSINESS': {
      const group = { ...state.business[action.group], [action.key]: action.value };
      return clampPersona({ ...state, business: { ...state.business, [action.group]: group } });
    }
    case 'SET_PERSONA':
      return { ...state, persona: action.persona };
    case 'SET_BRAND_COUNT':
      return resizeBrands(state, action.count, action.newId);
    case 'SET_ACTIVE_BRAND':
      return withActiveBrand(state, action.id);
    case 'SET_BRAND_NAME':
      return setBrandNameIn(state, action.id, action.name);
    case 'UPDATE_BRAND':
      return updateBrandIn(state, action.id, action.patch);
    case 'REORDER_BRAND':
      return reorderBrandIn(state, action.id, action.dir);
    case 'REMOVE_BRAND':
      return removeBrandFrom(state, action.id);
    case 'REPLACE':
      return clampPersona(normalizeBrands({
        ...action.state,
        business: normalizeBusiness(action.state.business),
        persona: action.state.persona ?? 'guest',
        sessionId: state.sessionId,
      }));
    case 'HYDRATE':
      // Restore a persisted session wholesale, keeping its own sessionId.
      return clampPersona(normalizeBrands({
        ...action.state,
        business: normalizeBusiness(action.state.business),
        persona: action.state.persona ?? 'guest',
        sessionId: action.state.sessionId || state.sessionId,
      }));
    case 'SYNC_SECTIONS': {
      // Ensure every enabled section has a variant; keep existing choices.
      const variants = { ...state.variants };
      action.sections.forEach((s) => {
        if (!variants[s.id]) variants[s.id] = s.defaultVariant;
      });
      return { ...state, variants };
    }
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------

type Ctx = {
  state: DesignState;
  sections: SectionDef[];
  products: Product[];
  categories: Category[];
  industries: IndustryPreset[];
  versions: Version[];
  images: ImageAsset[];
  catalogCustom: boolean;
  booting: boolean;
  sheetLive: boolean;
  setField: (key: keyof DesignState, value: unknown) => void;
  setVariant: (sectionId: string, v: Variant) => void;
  setCustomColors: (c: CustomColors) => void;
  applyIndustry: (industry: string) => void;
  toggleIntegration: (id: string, value: boolean) => void;
  setBusiness: (group: keyof WizOrderSimulation, key: string, value: unknown) => void;
  setPersona: (persona: PersonaId) => void;
  brands: BrandEntry[];
  activeBrandId: string;
  setBrandCount: (count: number) => void;
  setActiveBrand: (id: string) => void;
  setBrandName: (id: string, name: string) => void;
  setBrandStyle: (id: string, patch: Partial<BrandEntryT>) => void;
  reorderBrand: (id: string, dir: 'up' | 'down') => void;
  removeBrand: (id: string) => void;
  saveVersion: (name?: string) => Version;
  loadVersion: (id: string) => void;
  deleteVersion: (id: string) => void;
  renameVersion: (id: string, name: string) => void;
  setCatalog: (products: Product[], categories?: Category[]) => void;
  resetCatalog: () => void;
  addImage: (asset: { name: string; url: string }) => void;
  removeImage: (id: string) => void;
  renameImage: (id: string, name: string) => void;
  applyState: (s: DesignState) => void;
  reset: () => void;
};

const DesignCtx = createContext<Ctx | null>(null);

export function useDesign(): Ctx {
  const ctx = useContext(DesignCtx);
  if (!ctx) throw new Error('useDesign must be used within DesignProvider');
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function DesignProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<SectionDef[]>(SECTION_REGISTRY);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [industries, setIndustries] = useState<IndustryPreset[]>(INDUSTRY_PRESETS);
  const [versions, setVersions] = useState<Version[]>([]);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [catalogCustom, setCatalogCustom] = useState(false);
  const [booting, setBooting] = useState(true);
  const [sheetLive, setSheetLive] = useState(false);

  // Deterministic initial state (no localStorage) so SSR and the first client
  // render match — persisted state is hydrated in the effect below.
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    makeDefaultState(SECTION_REGISTRY, INDUSTRY_PRESETS),
  );

  // --- Boot: hydrate localStorage + snapshots, then pull sheet data --------
  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: 'HYDRATE', state: saved });
    else dispatch({ type: 'SET_FIELD', key: 'sessionId', value: getSessionId() });
    setVersions(loadVersions());
    setImages(loadImages());
    // A user-edited catalog overrides sheet/fallback data.
    const customCatalog = loadCatalog();
    if (customCatalog) {
      setProducts(customCatalog.products);
      setCategories(customCatalog.categories);
      setCatalogCustom(true);
    }
    let cancelled = false;

    (async () => {
      const [reg, presets, prods, cats] = await Promise.all([
        Sheet.loadSectionRegistry(),
        Sheet.loadIndustryPresets(),
        Sheet.loadProducts(),
        Sheet.loadCategories(),
      ]);
      if (cancelled) return;

      const live = !!(reg || presets || prods || cats);
      setSheetLive(live && Sheet.sheetConfigured());

      const activeSections = reg ?? SECTION_REGISTRY;
      setSections(activeSections);
      if (presets) setIndustries(presets);
      // Sheet/fallback catalog only applies when the user hasn't edited one.
      if (!customCatalog) {
        if (prods && prods.length) setProducts(prods);
        if (cats && cats.length) setCategories(cats);
      }

      // If we had no saved state, the default was built from fallback registry —
      // re-sync section variants against the (possibly live) registry.
      dispatch({ type: 'SYNC_SECTIONS', sections: activeSections });
      setBooting(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Persistence: instant localStorage + debounced sheet log -------------
  const lastPersisted = useRef<DesignState | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (booting) return;
    saveState(state); // (1)+(2) instant

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void flushDecisions(state, lastPersisted.current);
      lastPersisted.current = state;
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state, booting]);

  // --- Actions -------------------------------------------------------------
  const value = useMemo<Ctx>(() => {
    return {
      state,
      sections,
      products,
      categories,
      industries,
      versions,
      images,
      catalogCustom,
      booting,
      sheetLive,
      setField: (key, val) => dispatch({ type: 'SET_FIELD', key, value: val }),
      setVariant: (sectionId, v) => dispatch({ type: 'SET_VARIANT', sectionId, variant: v }),
      setCustomColors: (c) => dispatch({ type: 'SET_CUSTOM_COLORS', colors: c }),
      applyIndustry: (industry) => {
        const preset = industries.find((p) => p.industry === industry) ?? presetForIndustry(industry);
        if (preset) dispatch({ type: 'APPLY_INDUSTRY', preset });
        else dispatch({ type: 'SET_FIELD', key: 'industry', value: industry });
      },
      toggleIntegration: (id, val) => dispatch({ type: 'TOGGLE_INTEGRATION', id, value: val }),
      setBusiness: (group, key, val) => dispatch({ type: 'SET_BUSINESS', group, key, value: val }),
      setPersona: (persona) => dispatch({ type: 'SET_PERSONA', persona }),
      brands: resolveBrands(state),
      activeBrandId: state.activeBrandId ?? 'brand_1',
      setBrandCount: (count) => dispatch({ type: 'SET_BRAND_COUNT', count, newId: () => 'brand_' + uuid().slice(0, 6) }),
      setActiveBrand: (id) => dispatch({ type: 'SET_ACTIVE_BRAND', id }),
      setBrandName: (id, name) => dispatch({ type: 'SET_BRAND_NAME', id, name }),
      setBrandStyle: (id, patch) => dispatch({ type: 'UPDATE_BRAND', id, patch }),
      reorderBrand: (id, dir) => dispatch({ type: 'REORDER_BRAND', id, dir }),
      removeBrand: (id) => dispatch({ type: 'REMOVE_BRAND', id }),
      saveVersion: (name) => {
        const version: Version = {
          ...state,
          id: 'v_' + uuid().slice(0, 8),
          name: (name ?? '').trim() || `Version ${versions.length + 1}`,
          createdAt: new Date().toISOString(),
        };
        const next = [...versions, version];
        setVersions(next);
        saveVersions(next);
        void Sheet.replaceRows('Snapshots', versionRows(next));
        return version;
      },
      loadVersion: (id) => {
        const v = versions.find((x) => x.id === id);
        if (v) {
          const { id: _id, name: _n, createdAt: _c, ...st } = v;
          void _id; void _n; void _c;
          dispatch({ type: 'REPLACE', state: st });
        }
      },
      deleteVersion: (id) => {
        const next = versions.filter((x) => x.id !== id);
        setVersions(next);
        saveVersions(next);
        void Sheet.replaceRows('Snapshots', versionRows(next));
      },
      renameVersion: (id, name) => {
        const next = versions.map((x) => (x.id === id ? { ...x, name: name.trim() || x.name } : x));
        setVersions(next);
        saveVersions(next);
        void Sheet.replaceRows('Snapshots', versionRows(next));
      },
      setCatalog: (nextProducts, nextCategories) => {
        const cats = nextCategories ?? categoriesFromProducts(nextProducts, categories);
        setProducts(nextProducts);
        setCategories(cats);
        setCatalogCustom(true);
        saveCatalog({ products: nextProducts, categories: cats });
      },
      resetCatalog: () => {
        clearCatalog();
        setProducts(DEFAULT_PRODUCTS);
        setCategories(DEFAULT_CATEGORIES);
        setCatalogCustom(false);
      },
      addImage: (asset) => {
        const next = [
          ...images,
          { id: 'img_' + uuid().slice(0, 8), name: asset.name, url: asset.url, createdAt: new Date().toISOString() },
        ];
        setImages(next);
        saveImages(next);
      },
      removeImage: (id) => {
        const next = images.filter((x) => x.id !== id);
        setImages(next);
        saveImages(next);
      },
      renameImage: (id, name) => {
        const next = images.map((x) => (x.id === id ? { ...x, name: name.trim() || x.name } : x));
        setImages(next);
        saveImages(next);
      },
      applyState: (s) => dispatch({ type: 'REPLACE', state: s }),
      reset: () => dispatch({ type: 'REPLACE', state: makeDefaultState(sections, industries) }),
    };
  }, [state, sections, products, categories, industries, versions, images, catalogCustom, booting, sheetLive]);

  return <DesignCtx.Provider value={value}>{children}</DesignCtx.Provider>;
}

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function versionRows(versions: Version[]) {
  return versions.map((s) => ({
    'Snapshot Name': s.name,
    'Hero Variant': s.variants.hero ?? '',
    'Category Variant': s.variants.categories ?? '',
    'Product Variant': s.variants.featured ?? '',
    Palette: s.palette,
    Font: s.font,
  }));
}

// Diff current vs last-persisted state and append a Design Decisions row per change.
async function flushDecisions(curr: DesignState, prev: DesignState | null) {
  if (!Sheet.sheetConfigured()) return;
  const ts = new Date().toISOString();
  const rows: Record<string, unknown>[] = [];

  const log = (section: string, variant: string) =>
    rows.push({ 'Session ID': curr.sessionId, Section: section, Variant: variant, Timestamp: ts });

  if (!prev) {
    // First flush this session — record full snapshot of variants + settings.
    Object.entries(curr.variants).forEach(([k, v]) => log(k, v));
    log('palette', curr.palette);
    log('font', curr.font);
  } else {
    Object.entries(curr.variants).forEach(([k, v]) => {
      if (prev.variants[k] !== v) log(k, v);
    });
    (['palette', 'font', 'density', 'logoStyle', 'brandName', 'industry'] as const).forEach((k) => {
      if (prev[k] !== curr[k]) log(k, String(curr[k]));
    });
  }

  for (const row of rows) {
    // sequential to keep ordering; fire-and-forget failures are fine
    await Sheet.appendRow('Design Decisions', row);
  }
}

export type { DesignState, Variant, Density, LogoStyle };
