<script lang="ts">
  export let variant: 'default' | 'primary' | 'danger' = 'default';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled: boolean = false;
  export let fullWidth: boolean = false;

  $: cls =
    (variant === 'primary' ? 'ox-btn-primary' : variant === 'danger' ? 'ox-btn-danger' : 'ox-btn') +
    (fullWidth ? ' w-full' : '');
</script>

<button {type} {disabled} class={cls} on:click>
  <slot />
</button>
