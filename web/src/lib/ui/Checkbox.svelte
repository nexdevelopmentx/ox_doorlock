<script lang="ts">
  export let checked: boolean = false;
  export let label: string = '';
</script>

<label class="inline-flex cursor-pointer items-center gap-2.5 select-none">
  <input type="checkbox" class="ox-checkbox" bind:checked on:change />
  {#if label}<span class="text-[13px] text-ox-text">{label}</span>{/if}
</label>
