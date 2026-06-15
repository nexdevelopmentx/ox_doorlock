<script lang="ts">
  import Modal from '../../../lib/ui/Modal.svelte';
  import Select from '../../../lib/ui/Select.svelte';
  import NumberInput from '../../../lib/ui/NumberInput.svelte';
  import Button from '../../../lib/ui/Button.svelte';
  import { formStore } from '../../../lib/stores/form';

  export let open: boolean = false;
  export let index: number = 0;
  export let options: { value: string; label: string }[] = [];

  let select: string | null = null;
  let areaSize: number | null = null;
  let speedMultiplier: number | null = null;
  let error = '';

  $: if (open) {
    const data = $formStore.lockpickDifficulty[index];
    if (typeof data === 'string') {
      select = data === '' ? null : data;
      areaSize = null;
      speedMultiplier = null;
    } else if (data && typeof data === 'object') {
      select = 'custom';
      areaSize = data.areaSize;
      speedMultiplier = data.speedMultiplier;
    } else {
      select = null;
      areaSize = null;
      speedMultiplier = null;
    }
    error = '';
  }

  function save() {
    if (!select) {
      error = 'Difficulty is required';
      return;
    }
    if (select === 'custom' && (areaSize == null || speedMultiplier == null)) {
      error = 'Area size and speed multiplier are required';
      return;
    }
    const value =
      select === 'custom'
        ? { areaSize: areaSize as number, speedMultiplier: speedMultiplier as number }
        : select;

    formStore.update((s) => {
      const next = [...s.lockpickDifficulty];
      next[index] = value as any;
      return { ...s, lockpickDifficulty: next };
    });
    open = false;
  }
</script>

<Modal bind:open title="Lockpick difficulty" size="xs">
  <div class="flex flex-col gap-3">
    <Select label="Difficulty" bind:value={select} {options} placeholder="Difficulty" />
    <NumberInput
      label="Area size"
      description="Skill check area size in degrees"
      max={360}
      bind:value={areaSize}
      disabled={select !== 'custom'}
    />
    <NumberInput
      label="Speed multiplier"
      description="Number the indicator speed will be multiplied by"
      step={0.01}
      bind:value={speedMultiplier}
      disabled={select !== 'custom'}
    />
    {#if error}
      <p class="text-[12px] text-red-400">{error}</p>
    {/if}
    <Button variant="primary" fullWidth on:click={save}>Confirm</Button>
  </div>
</Modal>
