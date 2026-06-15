<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '../icons/Icon.svelte';

  export let open: boolean = false;
  export let title: string = '';
  export let size: 'xs' | 'sm' | 'md' = 'sm';
  export let withCloseButton: boolean = true;

  const dispatch = createEventDispatcher();

  $: widthClass = size === 'xs' ? 'max-w-[280px]' : size === 'md' ? 'max-w-[480px]' : 'max-w-[360px]';

  function close() {
    open = false;
    dispatch('close');
  }

  function onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-[3px] animate-fade-in"
    on:click={onBackdrop}
    on:keydown={(e) => e.key === 'Escape' && close()}
    role="dialog"
    tabindex="-1"
  >
    <div class="ox-panel w-full {widthClass} animate-scale-in p-5 mx-4">
      {#if title || withCloseButton}
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-[15px] font-semibold text-ox-bright">{title}</h3>
          {#if withCloseButton}
            <button class="ox-icon-btn" on:click={close} aria-label="Close">
              <Icon name="x" size={16} />
            </button>
          {/if}
        </div>
      {/if}
      <slot />
    </div>
  </div>
{/if}
