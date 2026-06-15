<script lang="ts">
  import { onMount } from 'svelte';
  import { route, navigate } from './lib/stores/router';
  import { visible } from './lib/stores/visibility';
  import { doors } from './lib/stores/doors';
  import { sounds } from './lib/stores/sounds';
  import { formStore } from './lib/stores/form';
  import { onNuiMessage } from './lib/nui/listener';
  import { fetchNui } from './lib/utils/fetchNui';
  import { convertData } from './lib/utils/convertData';
  import type { DoorColumn } from './lib/types';

  import Doors from './routes/Doors.svelte';
  import Settings from './routes/Settings.svelte';

  // ── NUI events ──
  onMount(() => {
    const off1 = onNuiMessage('playSound', async (data: { sound: string; volume: number }) => {
      try {
        const audio = new Audio(`./sounds/${data.sound}.ogg`);
        audio.volume = data.volume;
        await audio.play();
      } catch (e) {
        console.warn('playSound failed', e);
      }
    });

    const off2 = onNuiMessage('setSoundFiles', (data: string[]) => sounds.set(data));

    const off3 = onNuiMessage('setVisible', (data: number | undefined) => {
      visible.set(true);
      if (data === undefined || data === null) {
        navigate('/');
        return;
      }
      const list = $doors;
      const found = list.find((d) => d.id === data);
      if (found) {
        formStore.replace(convertData(found));
        navigate('/settings/general');
      }
    });

    const off4 = onNuiMessage('updateDoorData', (data: DoorColumn | DoorColumn[] | number) => {
      // Door id sent → delete that door from the list
      if (typeof data === 'number') {
        doors.update((list) => list.filter((d) => d.id !== data));
        return;
      }
      // Single door object with an id → upsert
      if (!Array.isArray(data) && (data as DoorColumn).id !== undefined) {
        doors.update((list) => {
          const idx = list.findIndex((d) => d.id === (data as DoorColumn).id);
          if (idx === -1) return [...list, data as DoorColumn];
          const next = [...list];
          next[idx] = data as DoorColumn;
          return next;
        });
        return;
      }
      // Array of doors (or object map) → replace
      doors.set(Object.values(data as any) as DoorColumn[]);
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        visible.set(false);
        fetchNui('exit');
      }
    };
    window.addEventListener('keyup', onKey);

    return () => {
      off1();
      off2();
      off3();
      off4();
      window.removeEventListener('keyup', onKey);
    };
  });

  $: isSettings = $route.startsWith('/settings');
</script>

<div class="flex h-full w-full items-center justify-center">
  {#if $visible}
    <div
      class="ox-panel flex flex-col overflow-hidden animate-slide-up"
      style="width: 720px; height: 520px;"
    >
      {#if isSettings}
        <Settings />
      {:else}
        <Doors />
      {/if}
    </div>
  {/if}
</div>
