<script lang="ts">
import { Dialog, IconButton } from '@silintl/ui-components'

export let content = ''
export let title = ''

let open = false

const buttons: Dialog.AlertButton[] = [{ label: 'Ok', action: 'cancel', class: 'mdc-dialog__button' }]
</script>

<IconButton class="gray" icon="info" on:click={() => (open = true)} />

<Dialog.Alert {open} {buttons} defaultAction="cancel" {title} titleIcon="info" on:closed={() => (open = false)}>
  {content}
</Dialog.Alert>
