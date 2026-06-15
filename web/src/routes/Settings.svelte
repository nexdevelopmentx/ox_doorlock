<script lang="ts">
  import { route, navigate } from '../lib/stores/router';
  import { formStore } from '../lib/stores/form';
  import Icon from '../lib/icons/Icon.svelte';

  import General from './settings/General.svelte';
  import Characters from './settings/Characters.svelte';
  import Groups from './settings/Groups.svelte';
  import Items from './settings/Items.svelte';
  import Lockpick from './settings/Lockpick.svelte';
  import Sound from './settings/Sound.svelte';
  import Submit from './settings/_Submit.svelte';

  $: current = $route.replace(/^\/settings\//, '') || 'general';

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'characters', label: 'Characters', icon: 'user' },
    { id: 'groups', label: 'Groups', icon: 'briefcase' },
    { id: 'items', label: 'Items', icon: 'bottle' },
    { id: 'lockpick', label: 'Lockpick', icon: 'lock' },
    { id: 'sound', label: 'Sound', icon: 'bell' },
  ];

  $: lockpickEnabled = !!$formStore.lockpick;
</script>

<div class="flex h-full">
  <!-- Sidebar -->
  <aside class="flex w-[180px] flex-col gap-1 border-r border-ox-border bg-ox-bg/40 p-3">
    <button class="ox-tab" on:click={() => navigate('/')}>
      <Icon name="arrowBack" size={16} /> Doors
    </button>
    <div class="my-2 ox-divider"></div>
    {#each tabs as t}
      <button
        class="ox-tab {current === t.id ? 'active' : ''}"
        disabled={t.id === 'lockpick' && !lockpickEnabled}
        on:click={() => navigate('/settings/' + t.id)}
      >
        <Icon name={t.icon} size={16} /> {t.label}
      </button>
    {/each}
  </aside>

  <!-- View -->
  <section class="flex flex-1 flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto p-5">
      {#if current === 'general'}
        <General />
      {:else if current === 'characters'}
        <Characters />
      {:else if current === 'groups'}
        <Groups />
      {:else if current === 'items'}
        <Items />
      {:else if current === 'lockpick'}
        <Lockpick />
      {:else if current === 'sound'}
        <Sound />
      {/if}
    </div>
    <div class="border-t border-ox-border p-4">
      <Submit />
    </div>
  </section>
</div>
