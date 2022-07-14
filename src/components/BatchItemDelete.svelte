<script lang="ts">
import { Button, Dialog, IconButton } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let openModal = false
export let disabled = false
export let allCheckedItemsAreDraft = false

const dispatch = createEventDispatcher<{ closed: string }>()

const buttons: Dialog.AlertButton[] = [
  { label: 'yes, delete', action: 'delete', class: 'error-button' },
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
]
let infoModalOpen = false

$: buttonLabel = allCheckedItemsAreDraft ? 'delete' : 'end coverage'

const handleDialog = (choice: string) => {
  openModal = false
  infoModalOpen = false
  dispatch('closed', choice)
}
</script>

<Button class="mb-1" {disabled} on:click={() => (openModal = true)}>{buttonLabel}</Button>

<IconButton class="gray" icon="info" on:click={() => (infoModalOpen = true)} />

<Dialog.Alert
  open={openModal}
  {buttons}
  defaultAction="cancel"
  title={'Delete/Remove Coverage'}
  on:chosen={(e) => handleDialog(e.detail)}
  on:closed={handleDialog}
  >Are you sure you would like to remove coverage or delete the selected items (coverage ends at a later date)?</Dialog.Alert
>

<Dialog.Alert
  open={infoModalOpen}
  buttons={[{ label: 'ok', action: 'cancel', class: 'mdc-dialog__button' }]}
  defaultAction="cancel"
  title={"Some items can't be deleted"}
  on:chosen={(e) => handleDialog(e.detail)}
  on:closed={handleDialog}
  >Items with no coverage, a scheduled end date, or an open claim can't be deleted.</Dialog.Alert
>
