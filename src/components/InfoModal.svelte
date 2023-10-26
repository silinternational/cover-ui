<script lang="ts">
import { IconButton } from '@silintl/ui-components'
import InfoDialog from './InfoDialog.svelte'

export let content = ''
export let title = ''
export let hasInfoButton = false
export let open = false
</script>

{#if hasInfoButton}
  <IconButton class="gray" icon="info" on:click={() => (open = true)} />
{/if}
<InfoDialog infoIsOpen={open} {title} on:closed={() => (open = false)}>
  {content}
</InfoDialog>
