<script lang="ts">
  export let danger: boolean = false;
  export let disabled: boolean = false;
  export let title: string = '';
</script>

<button
  type="button"
  {disabled}
  {title}
  class="ox-icon-btn {danger ? 'danger' : ''}"
  on:click
>
  <slot />
</button>
