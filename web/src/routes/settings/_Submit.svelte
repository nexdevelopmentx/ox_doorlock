<script lang="ts">
  import { formStore } from '../../lib/stores/form';
  import { clipboard } from '../../lib/stores/clipboard';
  import { visible } from '../../lib/stores/visibility';
  import { navigate } from '../../lib/stores/router';
  import { fetchNui } from '../../lib/utils/fetchNui';
  import Button from '../../lib/ui/Button.svelte';
  import IconButton from '../../lib/ui/IconButton.svelte';
  import Tooltip from '../../lib/ui/Tooltip.svelte';
  import Icon from '../../lib/icons/Icon.svelte';
  import ConfirmModal from '../../lib/ui/ConfirmModal.svelte';

  let confirmDelete = false;

  function buildPayload() {
    const data: any = { ...$formStore };

    if (data.name === '') data.name = null;
    if (data.passcode === '') data.passcode = null;
    if (data.lockSound === '') data.lockSound = null;
    if (data.unlockSound === '') data.unlockSound = null;

    data.autolock = data.autolock || null;
    data.maxDistance = data.maxDistance || 2;
    data.doorRate = data.doorRate ? data.doorRate + 0.0 : null;
    data.auto = data.auto || null;
    data.lockpick = data.lockpick || null;
    data.hideUi = data.hideUi || null;
    data.holdOpen = data.holdOpen || null;

    if (Array.isArray(data.items) && data.items.length > 0) {
      const items: any[] = [];
      for (const it of data.items) {
        if (it.name && it.name !== '') {
          if (it.metadata === '') it.metadata = null;
          if (!it.remove) it.remove = null;
          items.push(it);
        }
      }
      data.items = items;
    }

    if (Array.isArray(data.characters) && data.characters.length > 0) {
      const arr: Array<string | number> = [];
      for (const c of data.characters) {
        if (c && c !== '') {
          arr.push(Number.isNaN(+c) ? c : +c);
        }
      }
      data.characters = arr;
    }

    if (Array.isArray(data.groups) && data.groups.length > 0) {
      const obj: Record<string, number> = {};
      for (const g of data.groups) {
        if (g.name && g.name !== '') obj[g.name] = g.grade || 0;
      }
      data.groups = obj;
    } else {
      data.groups = null;
    }

    if (Array.isArray(data.lockpickDifficulty) && data.lockpickDifficulty.length > 0) {
      const arr: any[] = [];
      for (const f of data.lockpickDifficulty) if (f !== '') arr.push(f);
      data.lockpickDifficulty = arr;
    }

    return data;
  }

  function submit() {
    const payload = buildPayload();
    visible.set(false);
    fetchNui('createDoor', payload);
  }

  function applyClipboard() {
    const c = $clipboard;
    if (!c) return;
    formStore.update((s) => ({
      ...s,
      name: '',
      passcode: c.passcode,
      autolock: c.autolock,
      items: c.items,
      characters: c.characters,
      groups: c.groups,
      maxDistance: c.maxDistance,
      doorRate: c.doorRate,
      lockSound: c.lockSound,
      unlockSound: c.unlockSound,
      auto: c.auto,
      state: c.state,
      lockpick: c.lockpick,
      hideUi: c.hideUi,
      doors: c.doors,
      lockpickDifficulty: c.lockpickDifficulty,
      holdOpen: c.holdOpen,
    }));
    fetchNui('notify', 'Settings applied');
  }

  function doDelete() {
    if ($formStore.id != null) {
      fetchNui('deleteDoor', $formStore.id);
      navigate('/');
    }
  }
</script>

<div class="flex items-center gap-2">
  <Button variant="primary" fullWidth on:click={submit}>CONFIRM DOOR</Button>

  <Tooltip label={$clipboard ? 'Apply copied settings' : 'No door settings copied'} position="top">
    <IconButton disabled={!$clipboard} on:click={applyClipboard}>
      <Icon name="clipboardCheck" size={16} />
    </IconButton>
  </Tooltip>

  <Tooltip label="Delete door" position="top">
    <IconButton danger disabled={$formStore.id == null} on:click={() => (confirmDelete = true)}>
      <Icon name="trash" size={16} />
    </IconButton>
  </Tooltip>
</div>

<ConfirmModal bind:open={confirmDelete} title="Confirm deletion" danger on:confirm={doDelete}>
  Are you sure you want to delete <span class="font-semibold text-ox-bright">{$formStore.name}</span>?
</ConfirmModal>
