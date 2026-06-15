import { writable } from 'svelte/store';
import type { FormState } from '../types';

export const clipboard = writable<FormState | null>(null);
