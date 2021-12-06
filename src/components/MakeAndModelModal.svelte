<script lang="ts">
import { Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let open = true

let message = 'You may have difficulty getting coverage without a make and model.'
let title = 'Missing information'

const buttons: Dialog.AlertButton[] = [
  { label: 'Go Back', action: 'cancel', class: 'mdc-button--raised' },
  { label: 'Apply Anyway', action: 'submit', class: 'mdc-dialog__button' },
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
