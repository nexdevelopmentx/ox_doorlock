<script lang="ts">
  import { doors } from '../lib/stores/doors';
  import { searchValue, debouncedSearch } from '../lib/stores/search';
  import { visible } from '../lib/stores/visibility';
  import { clipboard } from '../lib/stores/clipboard';
  import { formStore } from '../lib/stores/form';
  import { navigate } from '../lib/stores/router';
  import { fetchNui } from '../lib/utils/fetchNui';
  import { convertData } from '../lib/utils/convertData';
  import type { DoorColumn } from '../lib/types';

  import IconButton from '../lib/ui/IconButton.svelte';
  import Tooltip from '../lib/ui/Tooltip.svelte';
  import Icon from '../lib/icons/Icon.svelte';
  import Pagination from '../lib/ui/Pagination.svelte';
  import ConfirmModal from '../lib/ui/ConfirmModal.svelte';

  type SortKey = 'id' | 'name' | 'zone';
  const columns: { k: SortKey; l: string; w: string }[] = [
    { k: 'id', l: 'ID', w: '12%' },
    { k: 'name', l: 'Name', w: '40%' },
    { k: 'zone', l: 'Zone', w: '36%' },
  ];
  let sortKey: SortKey | null = null;
  let sortDir: 'asc' | 'desc' = 'asc';
  let page = 1;
  const pageSize = 6;

  let menuFor: number | null = null;
  let menuX = 0;
  let menuY = 0;
  let confirmOpen = false;
  let confirmTarget: DoorColumn | null = null;
  const MENU_WIDTH = 192;
  const MENU_HEIGHT = 178;

  function openMenu(d: DoorColumn, e: MouseEvent) {
    e.stopPropagation();
    if (menuFor === d.id) {
      menuFor = null;
      return;
    }
    const btn = e.currentTarget as HTMLElement;
    const r = btn.getBoundingClientRect();
    // Anchor menu so its top-right aligns to the button's bottom-right.
    let x = r.right - MENU_WIDTH;
    let y = r.bottom + 4;
    // If it would overflow the bottom of the viewport, flip upward.
    if (y + MENU_HEIGHT > window.innerHeight - 8) {
      y = r.top - MENU_HEIGHT - 4;
    }
    // Clamp horizontally inside viewport.
    x = Math.max(8, Math.min(x, window.innerWidth - MENU_WIDTH - 8));
    menuX = x;
    menuY = y;
    menuFor = d.id;
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) node.parentNode.removeChild(node);
      },
    };
  }

  $: filtered = $doors.filter((d) => {
    if (!$debouncedSearch) return true;
    const q = $debouncedSearch.toLowerCase();
    return (
      (d.name || '').toLowerCase().includes(q) ||
      (d.zone || '').toLowerCase().includes(q)
    );
  });

  $: sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = (a as any)[sortKey!];
        const bv = (b as any)[sortKey!];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
    : filtered;

  $: pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  $: paged = sorted.slice((page - 1) * pageSize, page * pageSize);
  $: if (page > pageCount) page = pageCount;

  function toggleSort(k: SortKey) {
    if (sortKey === k) {
      if (sortDir === 'asc') sortDir = 'desc';
      else {
        sortKey = null;
      }
    } else {
      sortKey = k;
      sortDir = 'asc';
    }
  }

  function newDoor() {
    formStore.reset();
    navigate('/settings/general');
  }

  function close() {
    visible.set(false);
    fetchNui('exit');
  }

  function openSettings(d: DoorColumn) {
    formStore.replace(convertData(d));
    menuFor = null;
    navigate('/settings/general');
  }

  function copySettings(d: DoorColumn) {
    clipboard.set(convertData(d));
    fetchNui('notify', 'Settings copied');
    menuFor = null;
  }

  function teleport(d: DoorColumn) {
    visible.set(false);
    fetchNui('teleportToDoor', d.id);
    menuFor = null;
  }

  function askDelete(d: DoorColumn) {
    confirmTarget = d;
    confirmOpen = true;
    menuFor = null;
  }

  function doDelete() {
    if (confirmTarget) fetchNui('deleteDoor', confirmTarget.id);
    confirmTarget = null;
  }

  function onDocClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (!t.closest('[data-row-menu]')) menuFor = null;
  }
</script>

<svelte:window on:click={onDocClick} />

<!-- Header -->
<div class="flex items-center gap-3 border-b border-ox-border p-4">
  <Tooltip label="Create a new door" position="bottom">
    <IconButton on:click={newDoor}>
      <Icon name="plus" size={18} />
    </IconButton>
  </Tooltip>

  <div class="relative flex-1">
    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-ox-muted">
      <Icon name="search" size={16} />
    </span>
    <input
      class="ox-input pl-9"
      placeholder="Search doors…"
      bind:value={$searchValue}
    />
  </div>

  <Tooltip label="Close" position="bottom">
    <IconButton on:click={close}>
      <Icon name="x" size={18} />
    </IconButton>
  </Tooltip>
</div>

<!-- Table -->
<div class="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
  {#if sorted.length === 0}
    <div class="flex flex-1 flex-col items-center justify-center gap-3 text-ox-muted">
      <Icon name="search" size={42} />
      <p class="text-[14px]">No results found</p>
    </div>
  {:else}
    <div class="min-h-0 flex-1 overflow-hidden">
      <table class="w-full table-fixed border-separate" style="border-spacing: 0;">
        <thead>
          <tr>
            {#each columns as col}
              <th
                class="cursor-pointer border-b border-ox-border px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-ox-muted"
                style="width: {col.w}"
                on:click={() => toggleSort(col.k)}
              >
                <span class="inline-flex items-center gap-1.5">
                  {col.l}
                  {#if sortKey === col.k}
                    <Icon name={sortDir === 'asc' ? 'chevronUp' : 'chevronDown'} size={12} />
                  {:else}
                    <Icon name="selector" size={12} />
                  {/if}
                </span>
              </th>
            {/each}
            <th class="border-b border-ox-border" style="width: 12%"></th>
          </tr>
        </thead>
        <tbody>
          {#each paged as d (d.id)}
            <tr class="group transition-colors hover:bg-white/[0.03]">
              <td class="border-b border-ox-border px-3 py-2.5 text-[12px] font-mono text-ox-subtle">{d.id}</td>
              <td class="truncate border-b border-ox-border px-3 py-2.5 text-[13px] text-ox-text">{d.name}</td>
              <td class="truncate border-b border-ox-border px-3 py-2.5 text-[13px] text-ox-subtle">{d.zone}</td>
              <td class="border-b border-ox-border px-3 py-2.5 text-right" data-row-menu>
                <button
                  class="ox-icon-btn ml-auto"
                  on:click={(e) => openMenu(d, e)}
                  title="Door actions"
                >
                  <Icon name="dots" size={18} />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="mt-3 flex justify-center">
      <Pagination bind:page total={pageCount} />
    </div>
  {/if}
</div>

{#if menuFor !== null}
  {@const target = $doors.find((dd) => dd.id === menuFor)}
  {#if target}
    <div
      use:portal
      data-row-menu
      class="fixed z-[9999] w-48 overflow-hidden rounded-ox border border-white/[0.08] bg-ox-card shadow-xl animate-fade-in"
      style="left: {menuX}px; top: {menuY}px;"
    >
      <button class="ox-tab !rounded-none" on:click={() => openSettings(target)}>
        <Icon name="settings" size={16} /> Settings
      </button>
      <button class="ox-tab !rounded-none" on:click={() => copySettings(target)}>
        <Icon name="clipboardCopy" size={16} /> Copy settings
      </button>
      <button class="ox-tab !rounded-none" on:click={() => teleport(target)}>
        <Icon name="teleport" size={16} /> Teleport to door
      </button>
      <div class="ox-divider"></div>
      <button class="ox-tab !rounded-none !text-red-400 hover:!bg-red-500/10" on:click={() => askDelete(target)}>
        <Icon name="trash" size={16} /> Delete door
      </button>
    </div>
  {/if}
{/if}

<ConfirmModal
  bind:open={confirmOpen}
  title="Confirm deletion"
  danger
  on:confirm={doDelete}
>
  Are you sure you want to delete <span class="font-semibold text-ox-bright">{confirmTarget?.name}</span>?
</ConfirmModal>
