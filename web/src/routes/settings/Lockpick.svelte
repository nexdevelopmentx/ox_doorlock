<script lang="ts">
  import { onDestroy } from 'svelte';
  import { formStore } from '../../lib/stores/form';
  import RowLayout from './_RowLayout.svelte';
  import Select from '../../lib/ui/Select.svelte';
  import IconButton from '../../lib/ui/IconButton.svelte';
  import Tooltip from '../../lib/ui/Tooltip.svelte';
  import Icon from '../../lib/icons/Icon.svelte';
  import DifficultyModal from './_modals/DifficultyModal.svelte';

  const options = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'custom', label: 'Custom' },
  ];

  let modalOpen = false;
  let modalIndex = 0;

  function remove(i: number) {
    formStore.update((s) => ({
      ...s,
      lockpickDifficulty: s.lockpickDifficulty.filter((_, idx) => idx !== i),
    }));
  }
  function add() {
    formStore.update((s) => ({ ...s, lockpickDifficulty: [...s.lockpickDifficulty, ''] }));
  }
  function edit(i: number) {
    modalIndex = i;
    modalOpen = true;
  }

  onDestroy(() => {
    formStore.update((s) => ({
      ...s,
      lockpickDifficulty: s.lockpickDifficulty.filter((f, i) => i === 0 || f !== ''),
    }));
  });
</script>

<RowLayout onAdd={add} addLabel="Add difficulty">
  {#each $formStore.lockpickDifficulty as field, i (i)}
    <div class="flex items-center gap-2">
      <div class="flex-1">
        <Select
          options={options}
          value={typeof field === 'string' && field !== '' ? field : typeof field === 'object' ? 'custom' : null}
          placeholder="Edit row to select"
          disabled
        />
      </div>
      <Tooltip label="Edit row" position="left">
        <IconButton on:click={() => edit(i)}>
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

<DifficultyModal bind:open={modalOpen} index={modalIndex} options={options} />
