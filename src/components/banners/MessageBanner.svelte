<script lang="ts">
import StatusBanner from '../banners/StatusBanner.svelte'

const state = {
  icon: 'chat',
  color: '--mdc-theme-primary',
  bgColor: '--mdc-theme-primary-header-bg',
  title: '',
}
</script>

<StatusBanner class={$$props.class} {state}><slot /></StatusBanner>
