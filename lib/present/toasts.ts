// Present Mode V2 — toast helper (Step 25).

import type { Toast } from './presentState';
import { generateId } from './slugify';

export function createToast(message: string, type: Toast['type'] = 'success', duration = 3000): Toast {
  return { id: generateId(), message, type, duration };
}
