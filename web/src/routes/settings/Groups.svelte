<script lang="ts">
  import { onDestroy } from 'svelte';
  import { formStore } from '../../lib/stores/form';
  import RowLayout from './_RowLayout.svelte';
  import TextInput from '../../lib/ui/TextInput.svelte';
  import NumberInput from '../../lib/ui/NumberInput.svelte';
  import IconButton from '../../lib/ui/IconButton.svelte';
  import Tooltip from '../../lib/ui/Tooltip.svelte';
  import Icon from '../../lib/icons/Icon.svelte';

  function setName(i: number, val: string) {
    formStore.update((s) => {
      const next = [...s.groups];
      next[i] = { ...next[i], name: val };
      return { ...s, groups: next };
    });
  }
  function setGrade(i: number, val: number | null) {
    formStore.update((s) => {
      const next = [...s.groups];
      next[i] = { ...next[i], grade: val };
      return { ...s, groups: next };
    });
  }
  function remove(i: number) {
    formStore.update((s) => ({ ...s, groups: s.groups.filter((_, idx) => idx !== i) }));
  }
  function add() {
    formStore.update((s) => ({ ...s, groups: [...s.groups, { name: '', grade: null }] }));
  }

  onDestroy(() => {
    formStore.update((s) => ({
      ...s,
      groups: s.groups.filter((g, i) => i === 0 || g.name !== '' || g.grade != null),
    }));
  });
</script>

<RowLayout onAdd={add} addLabel="Add group">
  {#each $formStore.groups as field, i (i)}
    <div class="flex items-center gap-2">
      <div class="flex-1">
        <TextInput
          placeholder="Group"
          value={field.name ?? ''}
          on:input={(e) => setName(i, e.target.value)}
        />
      </div>
      <div class="w-28">
        {#key i}
          <NumberInput
            placeholder="Grade"
            value={field.grade ?? null}
            on:input={(e) => setGrade(i, e.target.value === '' ? null : Number(e.target.value))}
          />
        {/key}
      </div>
      <Tooltip label="Delete row" position="left">
        <IconButton danger on:click={() => remove(i)}>
          <Icon name="trash" size={16} />
        </IconButton>
      </Tooltip>
    </div>
  {/each}
</RowLayout>
