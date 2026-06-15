<script lang="ts">
  import Icon from '../icons/Icon.svelte';

  export let page: number = 1;
  export let total: number = 1;
  /** Number of page buttons shown on each side of the current page */
  export let siblings: number = 1;
  /** Number of page buttons always shown at the start and end */
  export let boundaries: number = 1;

  function range(start: number, end: number): number[] {
    const out: number[] = [];
    for (let i = start; i <= end; i++) out.push(i);
    return out;
  }

  // Truncated page range: 1 … 4 5 [6] 7 8 … 12
  $: items = (() => {
    const totalNumbers = siblings * 2 + 3 + boundaries * 2;
    if (total <= totalNumbers) return range(1, total);

    const leftSiblingIndex = Math.max(page - siblings, boundaries + 2);
    const rightSiblingIndex = Math.min(page + siblings, total - boundaries - 1);

    const showLeftDots = leftSiblingIndex > boundaries + 2;
    const showRightDots = rightSiblingIndex < total - boundaries - 1;

    const firstPages = range(1, boundaries);
    const lastPages = range(total - boundaries + 1, total);

    if (!showLeftDots && showRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2;
      return [...range(1, leftItemCount), 'dots' as const, ...lastPages];
    }
    if (showLeftDots && !showRightDots) {
      const rightItemCount = siblings * 2 + boundaries + 2;
      return [...firstPages, 'dots' as const, ...range(total - rightItemCount + 1, total)];
    }
    return [
      ...firstPages,
      'dots' as const,
      ...range(leftSiblingIndex, rightSiblingIndex),
      'dots' as const,
      ...lastPages,
    ];
  })();

  function go(p: number) {
    if (p < 1 || p > total) return;
    page = p;
  }
</script>

<nav class="flex items-center gap-1.5" aria-label="Pagination">
  <button
    type="button"
    class="ox-page-btn"
    disabled={page === 1 || total <= 1}
    on:click={() => go(page - 1)}
    aria-label="Previous page"
  >
    <Icon name="chevronLeft" size={14} />
  </button>

  {#each items as it}
    {#if it === 'dots'}
      <span class="flex h-7 min-w-[28px] items-center justify-center text-[12px] text-ox-muted">…</span>
    {:else}
      <button
        type="button"
        class="ox-page-btn {it === page ? 'active' : ''}"
        on:click={() => go(it)}
        aria-current={it === page ? 'page' : undefined}
      >
        {it}
      </button>
    {/if}
  {/each}

  <button
    type="button"
    class="ox-page-btn"
    disabled={page === total || total <= 1}
    on:click={() => go(page + 1)}
    aria-label="Next page"
  >
    <Icon name="chevronRight" size={14} />
  </button>
</nav>

<style>
  :global(.ox-page-btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    min-width: 28px;
    padding: 0 6px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    background: transparent;
    color: #a1a1aa;
    font-size: 12px;
    font-weight: 500;
    font-family: 'Inter', system-ui, sans-serif;
    cursor: pointer;
    transition: all 150ms ease;
  }
  :global(.ox-page-btn:hover:not(:disabled):not(.active)) {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.13);
    color: #fafafa;
  }
  :global(.ox-page-btn:active:not(:disabled)) {
    transform: scale(0.96);
  }
  :global(.ox-page-btn.active) {
    background: #fafafa;
    border-color: #fafafa;
    color: #09090b;
  }
  :global(.ox-page-btn:disabled) {
    opacity: 0.35;
    cursor: not-allowed;
  }
</style>
