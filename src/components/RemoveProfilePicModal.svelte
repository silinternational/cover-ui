<script lang="ts">
import { Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let open = false
const dispatch = createEventDispatcher<{ closed: string }>()

const buttons: Dialog.AlertButton[] = [
  { label: 'Yes, Remove', action: 'remove', class: 'error-button' },
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
]

const handleDialog = (choice: string) => {
  dispatch('closed', choice)
}
</script>

<Dialog.Alert
  {open}
  {buttons}
  defaultAction="cancel"
  title="Profile Picture Removal?"
  on:chosen={(e) => handleDialog(e.detail)}
  on:closed={handleDialog}
  >Are you sure you would like to remove your profile picture? This can't be undone.</Dialog.Alert
>
