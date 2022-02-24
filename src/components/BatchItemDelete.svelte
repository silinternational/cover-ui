<script type="ts">
import { Button, Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let openModal = false
export let disabled = false

const dispatch = createEventDispatcher<{ closed: string }>()

const buttons: Dialog.AlertButton[] = [
  { label: 'yes, delete', action: 'delete', class: 'error-button' },
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
]

const handleDialog = (choice: string) => {
  openModal = false
  dispatch('closed', choice)
}
</script>

<Button {disabled} on:click={() => (openModal = true)}>delete selected items</Button>

<Dialog.Alert
  open={openModal}
  {buttons}
  defaultAction="cancel"
  title={'Delete/Remove Coverage'}
  on:chosen={(e) => handleDialog(e.detail)}
  on:closed={handleDialog}
  >Are you sure you would like to remove coverage or delete the selected items (coverage ends at a later date)?</Dialog.Alert
>
