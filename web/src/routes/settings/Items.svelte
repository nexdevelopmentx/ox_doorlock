<script lang="ts">
  import { onDestroy } from 'svelte';
  import { formStore } from '../../lib/stores/form';
  import RowLayout from './_RowLayout.svelte';
  import TextInput from '../../lib/ui/TextInput.svelte';
  import IconButton from '../../lib/ui/IconButton.svelte';
  import Tooltip from '../../lib/ui/Tooltip.svelte';
  import Icon from '../../lib/icons/Icon.svelte';
  import ItemsModal from './_modals/ItemsModal.svelte';

  let modalOpen = false;
  let modalIndex = 0;

  function setName(i: number, val: string) {
    formStore.update((s) => {
      const next = [...s.items];
      next[i] = { ...next[i], name: val };
      return { ...s, items: next };
    });
  }
  function onName(i: number, e: Event) {
    setName(i, (e.target as HTMLInputElement).value);
  }
  function remove(i: number) {
    formStore.update((s) => ({ ...s, items: s.items.filter((_, idx) => idx !== i) }));
  }
  function add() {
    formStore.update((s) => ({ ...s, items: [...s.items, { name: '', metadata: '', remove: false }] }));
  }
  function openOptions(i: number) {
    modalIndex = i;
    modalOpen = true;
  }

  onDestroy(() => {
    formStore.update((s) => ({
      ...s,
      items: s.items.filter((it, i) => i === 0 || (it.name && it.name !== '')),
    }));
  });
</script>

<RowLayout onAdd={add} addLabel="Add item">
  {#each $formStore.items as field, i (i)}
    <div class="flex items-center gap-2">
      <TextInput
        placeholder="Item"
        value={field.name ?? ''}
        on:input={(e) => onName(i, e)}
      />
      <Tooltip label="Item options" position="left">
        <IconButton on:click={() => openOptions(i)}>
          <Icon name="settings" size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip label="Delete row" position="left">
        <IconButton danger on:click={() => remove(i)}>
          <Icon name="trash" size={16} />
        </IconButton>
      </Tooltip>
    </div>
  {/each}
</RowLayout>

<ItemsModal bind:open={modalOpen} index={modalIndex} />
