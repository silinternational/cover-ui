<script>

export let color = 'white'
export let border = 'none'
export let background = 'var(--mdc-theme-primary)'

</script>

<style>
.badge {
  padding: 8px;
  align-items: center;
  display: flex;
  width: max-content;
  border-radius: 4px;
}
</style>

<div class="badge {$$props.class}" style="color: {color}; border: {border}; background-color: {background};">
  <slot />
</div>