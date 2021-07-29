<script>
import { loading } from './index'
</script>

<style>
progress {
  width: 100%;
  position: relative;
  top: -5px;
}
</style>

{#if $loading}
  <progress />
{/if}