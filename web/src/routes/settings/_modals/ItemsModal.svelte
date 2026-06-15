<script lang="ts">
  import Modal from '../../../lib/ui/Modal.svelte';
  import TextInput from '../../../lib/ui/TextInput.svelte';
  import Switch from '../../../lib/ui/Switch.svelte';
  import Button from '../../../lib/ui/Button.svelte';
  import { formStore } from '../../../lib/stores/form';

  export let open: boolean = false;
  export let index: number = 0;

  let metadata = '';
  let removeOnUse = false;

  $: if (open) {
    const item = $formStore.items[index];
    metadata = (item?.metadata as string) ?? '';
    removeOnUse = !!item?.remove;
  }

  function save() {
    formStore.update((s) => {
      const next = [...s.items];
      next[index] = { ...next[index], metadata, remove: removeOnUse };
      return { ...s, items: next };
    });
    open = false;
  }
</script>

<Modal bind:open title="Item options" size="xs">
  <div class="flex flex-col gap-3">
    <TextInput label="Metadata type" bind:value={metadata} />
    <Switch label="Remove on use" bind:checked={removeOnUse} />
    <Button variant="primary" fullWidth on:click={save}>Confirm</Button>
  </div>
</Modal>
