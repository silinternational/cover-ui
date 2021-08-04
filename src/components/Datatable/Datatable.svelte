<!-- https://github.com/material-components/material-components-web/tree/master/packages/mdc-data-table -->
<script>

export let label = ''

let element = {}

</script>

<div class="mdc-data-table w-100 {$$props.class}" bind:this={element}>
  <div class="mdc-data-table__table-container">
    <table class="mdc-data-table__table" aria-label={label}>
      <slot />
    </table>
  </div>
</div>
