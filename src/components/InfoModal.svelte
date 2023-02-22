<script lang="ts">
import { Dialog, IconButton } from '@silintl/ui-components'

export let content = ''
export let title = ''
export let hasButton = false
export let open = false

const buttons: Dialog.AlertButton[] = [{ label: 'Ok', action: 'cancel', class: 'mdc-dialog__button' }]
</script>

{#if hasButton}
  <IconButton class="gray" icon="info" on:click={() => (open = true)} />
{/if}
<Dialog.Alert {open} {buttons} defaultAction="cancel" {title} titleIcon="info" on:closed={() => (open = false)}>
  {content}
</Dialog.Alert>
