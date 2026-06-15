<script lang="ts">
  import { onDestroy } from 'svelte';
  import { formStore } from '../../lib/stores/form';
  import RowLayout from './_RowLayout.svelte';
  import TextInput from '../../lib/ui/TextInput.svelte';
  import IconButton from '../../lib/ui/IconButton.svelte';
  import Tooltip from '../../lib/ui/Tooltip.svelte';
  import Icon from '../../lib/icons/Icon.svelte';

  function update(i: number, val: string) {
    formStore.update((s) => {
      const next = [...s.characters];
      next[i] = val;
      return { ...s, characters: next };
    });
  }
  function onInput(i: number, e: Event) {
    update(i, (e.target as HTMLInputElement).value);
  }
  function remove(i: number) {
    formStore.update((s) => ({ ...s, characters: s.characters.filter((_, idx) => idx !== i) }));
  }
  function add() {
    formStore.update((s) => ({ ...s, characters: [...s.characters, ''] }));
  }

  onDestroy(() => {
    formStore.update((s) => ({
      ...s,
      characters: s.characters.filter((c, i) => i === 0 || (c !== '' && c != null)),
    }));
  });
</script>

<RowLayout onAdd={add} addLabel="Add character">
  {#each $formStore.characters as field, i (i)}
    <div class="flex items-center gap-2">
      <TextInput
        placeholder="Character ID"
        value={field ?? ''}
        on:input={(e) => onInput(i, e)}
      />
      <Tooltip label="Delete row" position="left">
        <IconButton danger on:click={() => remove(i)}>
          <Icon name="trash" size={16} />
        </IconButton>
      </Tooltip>
    </div>
  {/each}
</RowLayout>
