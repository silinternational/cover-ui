<script>
export let clickable = false
</script>

{#if clickable}
  <style>
    tr {
      cursor: pointer;
    }
  </style>
{/if}

<tr on:click class="mdc-data-table__row">
  <slot />
</tr>