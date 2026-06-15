<script lang="ts">
  import Button from '../../lib/ui/Button.svelte';
  import Icon from '../../lib/icons/Icon.svelte';
  export let onAdd: () => void;
  export let addLabel: string = 'Add row';
</script>

<div class="flex flex-col gap-3">
  <slot />
  <Button on:click={onAdd} fullWidth>
    <Icon name="plus" size={16} /> {addLabel}
  </Button>
</div>
