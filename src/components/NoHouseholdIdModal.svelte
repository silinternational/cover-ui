<script lang="ts">
import { Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let open = true

let message = 'A household ID is required before getting coverage. Add it in Policy Settings.'
let title = 'Missing information'

const buttons: Dialog.AlertButton[] = [
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
  { label: 'Policy Settings', action: 'gotoSettings', class: 'mdc-button--raised' },
]

const dispatch = createEventDispatcher<{ closed: string }>()

const handleDialog = (choice: string) => {
  open = false
  dispatch('closed', choice)
}
</script>

<Dialog.Alert
  {open}
  {buttons}
  defaultAction="cancel"
  {title}
  on:chosen={(e) => handleDialog(e.detail)}
  on:closed={handleDialog}>{message}</Dialog.Alert
>
