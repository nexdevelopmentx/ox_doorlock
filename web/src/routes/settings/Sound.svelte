<script lang="ts">
  import { formStore } from '../../lib/stores/form';
  import { sounds } from '../../lib/stores/sounds';
  import Select from '../../lib/ui/Select.svelte';

  $: options = $sounds.map((s) => ({ value: s, label: s }));

  function setLock(e: CustomEvent<string | null>) {
    formStore.update((s) => ({ ...s, lockSound: e.detail }));
  }
  function setUnlock(e: CustomEvent<string | null>) {
    formStore.update((s) => ({ ...s, unlockSound: e.detail }));
  }
</script>

<div class="flex flex-col gap-4">
  <Select
    label="Lock sound"
    value={$formStore.lockSound || null}
    {options}
    searchable
    clearable
    nothingFound="No such sound"
    on:change={setLock}
  />
  <Select
    label="Unlock sound"
    value={$formStore.unlockSound || null}
    {options}
    searchable
    clearable
    nothingFound="No such sound"
    on:change={setUnlock}
  />
</div>
