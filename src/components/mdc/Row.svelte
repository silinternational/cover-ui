<script>
export let cols = '12' //number of colums can be up to 12
</script>

<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-{cols} {$$props.class}">
  <slot/>
</div>