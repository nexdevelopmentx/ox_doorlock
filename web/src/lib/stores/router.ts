import { writable } from 'svelte/store';

/**
 * Hash-based router. Routes:
 *   /                       — door list
 *   /settings/general       — settings tabs
 *   /settings/characters
 *   /settings/groups
 *   /settings/items
 *   /settings/lockpick
 *   /settings/sound
 */
export const route = writable<string>(getHash());

function getHash(): string {
  if (typeof window === 'undefined') return '/';
  const h = window.location.hash.replace(/^#/, '');
  return h || '/';
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => route.set(getHash()));
}

export function navigate(path: string) {
  if (typeof window === 'undefined') return;
  window.location.hash = path;
  route.set(path);
}
