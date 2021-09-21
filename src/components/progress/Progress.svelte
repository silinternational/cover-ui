<script lang="ts">
import { Progress } from '@silintl/ui-components'

import { loading } from './index'
</script>

<style>
.progress {
  top: -5px;
}
</style>

{#if $loading}
  <div class="progress w-100 relative">
    <Progress.Linear indeterminate />
  </div>
{/if}
