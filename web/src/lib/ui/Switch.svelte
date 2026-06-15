<script lang="ts">
  export let checked: boolean = false;
  export let label: string = '';
  export let disabled: boolean = false;
</script>

<label class="inline-flex cursor-pointer items-center gap-2.5 select-none {disabled ? 'opacity-40 cursor-not-allowed' : ''}">
  <span class="ox-switch">
    <input type="checkbox" {disabled} checked={checked} on:change />
    <span class="track"><span class="thumb" /></span>
  </span>
  {#if label}<span class="text-[13px] text-ox-text">{label}</span>{/if}
</label>
