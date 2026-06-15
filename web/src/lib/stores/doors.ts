import { writable } from 'svelte/store';
import type { DoorColumn } from '../types';

export const doors = writable<DoorColumn[]>([]);
