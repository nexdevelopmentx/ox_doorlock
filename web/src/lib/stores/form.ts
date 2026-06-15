import { writable } from 'svelte/store';
import type { FormState } from '../types';

export const defaultFormState: FormState = {
  id: undefined,
  name: '',
  passcode: '',
  autolock: 0,
  items: [{ name: '', metadata: '', remove: false }],
  characters: [''],
  groups: [{ name: '', grade: undefined }],
  lockpickDifficulty: [''],
  maxDistance: 0,
  doorRate: 0,
  lockSound: '',
  unlockSound: '',
  auto: false,
  state: false,
  lockpick: false,
  hideUi: false,
  doors: false,
  holdOpen: false,
};

function createFormStore() {
  const { subscribe, set, update } = writable<FormState>({ ...defaultFormState });
  return {
    subscribe,
    set,
    update,
    reset: () => set({ ...defaultFormState, items: [{ name: '', metadata: '', remove: false }], characters: [''], groups: [{ name: '', grade: undefined }], lockpickDifficulty: [''] }),
    replace: (data: FormState) => set(data),
    patch: (partial: Partial<FormState>) => update((s) => ({ ...s, ...partial })),
  };
}

export const formStore = createFormStore();
