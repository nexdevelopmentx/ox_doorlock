<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import Icon from '../icons/Icon.svelte';
  const dispatch = createEventDispatcher<{ change: string | null }>();

  type Option = { value: string; label: string };

  export let label: string = '';
  export let value: string | null = null;
  export let options: Option[] = [];
  export let placeholder: string = 'Select…';
  export let searchable: boolean = false;
  export let clearable: boolean = false;
  export let disabled: boolean = false;
  export let nothingFound: string = 'Nothing found';

  let open = false;
  let query = '';
  let root: HTMLDivElement;

  $: filtered = searchable && query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  $: currentLabel = options.find((o) => o.value === value)?.label ?? '';

  function pick(v: string) {
    value = v;
    open = false;
    query = '';
    dispatch('change', v);
  }

  function clear(e: Event) {
    e.stopPropagation();
    value = null;
    dispatch('change', null);
  }

  function handleClickOutside(e: MouseEvent) {
    if (root && !root.contains(e.target as Node)) {
      open = false;
      query = '';
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });
</script>

<div class="w-full" bind:this={root}>
  {#if label}<label class="ox-label">{label}</label>{/if}
  <div class="relative">
    <button
      type="button"
      class="ox-input flex items-center justify-between text-left {disabled ? 'opacity-40 cursor-not-allowed' : ''}"
      on:click={() => !disabled && (open = !open)}
      {disabled}
    >
      <span class={currentLabel ? 'text-ox-bright' : 'text-[#52525b]'}>
        {currentLabel || placeholder}
      </span>
      <span class="flex items-center gap-1 text-ox-muted">
        {#if clearable && value}
          <span
            class="hover:text-ox-bright"
            on:click={clear}
            on:keydown={(e) => e.key === 'Enter' && clear(e)}
            role="button"
            tabindex="0"
          >
            <Icon name="x" size={14} />
          </span>
        {/if}
        <Icon name={open ? 'chevronUp' : 'chevronDown'} size={14} />
      </span>
    </button>
    {#if open}
      <div class="absolute z-50 mt-1 w-full overflow-hidden rounded-ox border border-white/[0.08] bg-ox-card shadow-xl animate-fade-in">
        {#if searchable}
          <div class="border-b border-ox-border p-2">
            <input
              class="w-full rounded-ox-sm border border-ox-border bg-ox-bg px-2 py-1 text-[12px] text-ox-bright outline-none focus:border-white/20"
              placeholder="Search…"
              bind:value={query}
            />
          </div>
        {/if}
        <div class="max-h-48 overflow-y-auto py-1">
          {#each filtered as opt (opt.value)}
            <div
              class="cursor-pointer px-3 py-2 text-[13px] text-ox-subtle transition-colors hover:bg-white/[0.04] hover:text-ox-bright {opt.value === value ? 'bg-white/[0.06] text-ox-bright' : ''}"
              on:click={() => pick(opt.value)}
              on:keydown={(e) => e.key === 'Enter' && pick(opt.value)}
              role="button"
              tabindex="0"
            >
              {opt.label}
            </div>
          {:else}
            <div class="px-3 py-2 text-[12px] text-ox-muted">{nothingFound}</div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
