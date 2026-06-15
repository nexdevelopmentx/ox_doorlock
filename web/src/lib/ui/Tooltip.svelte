<script lang="ts">
  import { tick } from 'svelte';

  export let label: string = '';
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  let trigger: HTMLSpanElement;
  let tip: HTMLDivElement | null = null;
  let open = false;
  let x = 0;
  let y = 0;

  async function show() {
    if (!label) return;
    open = true;
    await tick();
    if (!trigger || !tip) return;
    const r = trigger.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const gap = 6;
    if (position === 'top') {
      x = r.left + r.width / 2 - tw / 2;
      y = r.top - th - gap;
    } else if (position === 'bottom') {
      x = r.left + r.width / 2 - tw / 2;
      y = r.bottom + gap;
    } else if (position === 'left') {
      x = r.left - tw - gap;
      y = r.top + r.height / 2 - th / 2;
    } else {
      x = r.right + gap;
      y = r.top + r.height / 2 - th / 2;
    }
    // keep within viewport
    const pad = 4;
    x = Math.max(pad, Math.min(x, window.innerWidth - tw - pad));
    y = Math.max(pad, Math.min(y, window.innerHeight - th - pad));
  }

  function hide() {
    open = false;
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) node.parentNode.removeChild(node);
      },
    };
  }
</script>

<span
  bind:this={trigger}
  class="relative inline-flex"
  on:mouseenter={show}
  on:mouseleave={hide}
  on:focusin={show}
  on:focusout={hide}
  role="presentation"
>
  <slot />
</span>

{#if open && label}
  <div
    bind:this={tip}
    use:portal
    class="pointer-events-none fixed z-[9999] whitespace-nowrap rounded-ox-sm border border-white/[0.08] bg-ox-card px-2 py-1 text-[11px] font-medium text-ox-bright shadow-lg animate-fade-in"
    style="left: {x}px; top: {y}px;"
  >
    {label}
  </div>
{/if}
