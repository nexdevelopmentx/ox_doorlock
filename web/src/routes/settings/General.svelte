<script lang="ts">
  import { formStore } from '../../lib/stores/form';
  import TextInput from '../../lib/ui/TextInput.svelte';
  import NumberInput from '../../lib/ui/NumberInput.svelte';
  import Switch from '../../lib/ui/Switch.svelte';
  import Tooltip from '../../lib/ui/Tooltip.svelte';
  import Icon from '../../lib/icons/Icon.svelte';
  import type { FormState } from '../../lib/types';

  function setText<K extends 'name' | 'passcode'>(key: K, e: Event) {
    const v = (e.currentTarget as HTMLInputElement).value;
    formStore.update((s) => ({ ...s, [key]: v } as FormState));
  }

  function setNum<K extends 'autolock' | 'maxDistance' | 'doorRate'>(key: K, e: Event) {
    const raw = (e.currentTarget as HTMLInputElement).value;
    const v = raw === '' ? null : Number(raw);
    formStore.update((s) => ({ ...s, [key]: Number.isNaN(v as number) ? null : v } as FormState));
  }

  function toggle(key: 'state' | 'doors' | 'auto' | 'lockpick' | 'hideUi' | 'holdOpen', e: Event) {
    const checked = (e.currentTarget as HTMLInputElement).checked;
    formStore.update((s) => ({ ...s, [key]: checked } as FormState));
  }

  const switches: Array<{ key: 'state' | 'doors' | 'auto' | 'lockpick' | 'hideUi' | 'holdOpen'; label: string; info: string }> = [
    { key: 'state', label: 'Locked', info: 'Sets whether the targeting door is locked by default' },
    { key: 'doors', label: 'Double', info: 'Enable if the targeting door is a double door' },
    { key: 'auto', label: 'Automatic', info: 'Enable if the door moves automatically (garage, poles, etc.)' },
    { key: 'lockpick', label: 'Lockpick', info: 'Enables the door to be lockpicked. Difficulties can be defined in the Lockpick tab' },
    { key: 'hideUi', label: 'Hide UI', info: 'Hides UI indicators for the targeting door' },
    { key: 'holdOpen', label: 'Hold Open', info: 'Sets whether the door(s) should stay open while unlocked' },
  ];
</script>

<div class="grid grid-cols-2 gap-4">
  <TextInput
    label="Door name"
    value={$formStore.name ?? ''}
    on:input={(e) => setText('name', e)}
  />
  <TextInput
    label="Passcode"
    value={$formStore.passcode ?? ''}
    on:input={(e) => setText('passcode', e)}
  />
  <NumberInput
    label="Autolock interval"
    value={$formStore.autolock ?? null}
    infoCircle="Time in seconds after which the door will be locked"
    on:input={(e) => setNum('autolock', e)}
  />
  <NumberInput
    label="Interact distance"
    value={$formStore.maxDistance ?? null}
    infoCircle="Controls the distance from which the player can interact with the door"
    on:input={(e) => setNum('maxDistance', e)}
  />
  <div class="col-span-2">
    <NumberInput
      label="Door rate"
      value={$formStore.doorRate ?? null}
      infoCircle="Speed the automatic door will move at"
      on:input={(e) => setNum('doorRate', e)}
    />
  </div>
</div>

<div class="ox-divider my-5"></div>

<div class="grid grid-cols-2 gap-y-3 gap-x-6">
  {#each switches as s}
    <div class="flex items-center justify-between">
      <Switch
        label={s.label}
        checked={!!$formStore[s.key]}
        on:change={(e) => toggle(s.key, e)}
      />
      <Tooltip label={s.info} position="left">
        <span class="text-ox-muted hover:text-ox-subtle"><Icon name="question" size={14} /></span>
      </Tooltip>
    </div>
  {/each}
</div>
