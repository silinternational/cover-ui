<script lang="ts">
export let color = 'white'
export let border = 'none'
export let background = 'var(--mdc-theme-primary)'
</script>

<style>
.banner {
  border-radius: 4px;
  padding: 0.5rem;
}
</style>

<div
  class="banner flex align-items-center {$$props.class}"
  style:color
  style:border
  style:background-color={background}
>
  <slot />
</div>
