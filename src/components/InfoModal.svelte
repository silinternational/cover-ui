<script lang="ts">
import { Dialog } from '@silintl/ui-components'

export let open = false
export let content = ''
export let title = ''

const buttons: Dialog.AlertButton[] = [{ label: 'Ok', action: 'cancel', class: 'mdc-dialog__button' }]
</script>

<Dialog.Alert {open} {buttons} defaultAction="cancel" {title} titleIcon="info" on:closed>
  {content}
</Dialog.Alert>
