<script lang="ts">
import { Progress } from '@silintl/ui-components'

import { loading } from './index'
</script>

<style>
.progress {
  top: 3rem;
}
</style>

{#if $loading}
  <div class="progress w-100 absolute">
    <Progress.Linear indeterminate />
  </div>
{/if}
