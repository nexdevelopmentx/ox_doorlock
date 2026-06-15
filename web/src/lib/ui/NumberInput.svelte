<script lang="ts">
  import Tooltip from './Tooltip.svelte';
  import Icon from '../icons/Icon.svelte';

  export let label: string = '';
  export let value: number | null = 0;
  export let placeholder: string = '';
  export let infoCircle: string = '';
  export let step: number = 0.1;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let disabled: boolean = false;
  export let description: string = '';
</script>

<div class="w-full">
  {#if label}
    <label class="ox-label">
      {label}
      {#if infoCircle}
        <Tooltip label={infoCircle} position="top">
          <span class="text-ox-muted hover:text-ox-subtle"><Icon name="question" size={14} /></span>
        </Tooltip>
      {/if}
    </label>
  {/if}
  <input
    type="number"
    class="ox-input"
    {placeholder}
    {step}
    {min}
    {max}
    {disabled}
    value={value ?? ''}
    on:input
    on:change
  />
  {#if description}
    <p class="mt-1 text-[11px] text-ox-muted">{description}</p>
  {/if}
</div>
