import { writable, derived, get } from 'svelte/store';

export const searchValue = writable<string>('');
export const debouncedSearch = writable<string>('');

let timer: ReturnType<typeof setTimeout> | null = null;

searchValue.subscribe((v) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => debouncedSearch.set(v), 300);
});

export { derived, get };
