import './app.css';
import App from './App.svelte';
import { initNuiListener } from './lib/nui/listener';
import { debugData } from './lib/utils/debugData';
import { isEnvBrowser } from './lib/utils/misc';
import type { DoorColumn } from './lib/types';

initNuiListener();

// ── Browser-only debug events ──
debugData<DoorColumn[]>([
  {
    action: 'updateDoorData',
    data: [
      {
        name: 'Door name',
        passcode: 'Supersecret123',
        autolock: 300,
        id: 0,
        zone: 'Mission Row',
        characters: ['charid1', 'charid2'],
        groups: { police: 0, ambulance: 1 },
        items: [{ name: 'mrpd_key', metadata: 'lspd_key', remove: true }],
        lockpickDifficulty: [],
        lockSound: null,
        unlockSound: null,
        maxDistance: 15.2,
        state: true,
        doors: true,
        auto: true,
        lockpick: true,
        hideUi: true,
        doorRate: null,
        holdOpen: true,
      },
    ],
  },
]);

debugData([{ action: 'setVisible', data: undefined }], 1500);

debugData<string[]>([
  {
    action: 'setSoundFiles',
    data: ['button-remote', 'door-bolt-4', 'metal-locker', 'metallic-creak'],
  },
]);

if (isEnvBrowser()) {
  const root = document.getElementById('app');
  if (root) {
    root.style.backgroundImage = 'url("https://i.imgur.com/3pzRj9n.png")';
    root.style.backgroundSize = 'cover';
    root.style.backgroundRepeat = 'no-repeat';
    root.style.backgroundPosition = 'center';
  }
}

const app = new App({
  target: document.getElementById('app')!,
});

export default app;
