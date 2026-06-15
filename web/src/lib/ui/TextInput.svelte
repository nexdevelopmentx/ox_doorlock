<script lang="ts">
  import Tooltip from './Tooltip.svelte';
  import Icon from '../icons/Icon.svelte';

  export let label: string = '';
  export let value: string = '';
  export let placeholder: string = '';
  export let infoCircle: string = '';
  export let leftIcon: string = '';
  export let disabled: boolean = false;
  export let id: string | undefined = undefined;
</script>

<div class="w-full">
  {#if label}
    <label class="ox-label" for={id}>
      {label}
      {#if infoCircle}
        <Tooltip label={infoCircle} position="top">
          <span class="text-ox-muted hover:text-ox-subtle"><Icon name="question" size={14} /></span>
        </Tooltip>
      {/if}
    </label>
  {/if}
  <div class="relative">
    {#if leftIcon}
      <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-ox-muted">
        <Icon name={leftIcon} size={16} />
      </span>
    {/if}
    <input
      {id}
      type="text"
      class="ox-input {leftIcon ? 'pl-9' : ''}"
      {placeholder}
      {disabled}
      value={value ?? ''}
      on:input
      on:change
    />
  </div>
</div>
