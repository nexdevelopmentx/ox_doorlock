import { writable } from 'svelte/store';
export const sounds = writable<string[]>([]);
