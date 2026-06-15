<script lang="ts">
  import Modal from './Modal.svelte';
  import Button from './Button.svelte';
  import { createEventDispatcher } from 'svelte';

  export let open: boolean = false;
  export let title: string = 'Confirm';
  export let confirmLabel: string = 'Confirm';
  export let cancelLabel: string = 'Cancel';
  export let danger: boolean = false;

  const dispatch = createEventDispatcher();

  function confirm() {
    open = false;
    dispatch('confirm');
  }
  function cancel() {
    open = false;
    dispatch('cancel');
  }
</script>

<Modal bind:open {title} size="sm" withCloseButton={false}>
  <div class="text-[13px] text-ox-text">
    <slot />
  </div>
  <div class="mt-5 flex justify-end gap-2">
    <Button on:click={cancel}>{cancelLabel}</Button>
    <Button variant={danger ? 'danger' : 'primary'} on:click={confirm}>{confirmLabel}</Button>
  </div>
</Modal>
