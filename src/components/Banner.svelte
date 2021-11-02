<script lang="ts">
export let color = 'white'
export let border = 'none'
export let background = 'var(--mdc-theme-primary)'
</script>

<style>
.banner {
  border-radius: 4px;
}
</style>

<div
  class="banner flex align-items-center p-8px {$$props.class}"
  style="color: {color}; border: {border}; background-color: {background};"
>
  <slot />
</div>
