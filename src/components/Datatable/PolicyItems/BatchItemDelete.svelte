<script lang="ts">
import InfoModal from '../../InfoModal.svelte'
import { Button, Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let modalIsOpen = false
export let isDisabled = false
export let buttonLabel = 'end coverage'

let infoModalContent = "Items with no coverage, a scheduled end date, or an open claim can't be deleted."

const dispatch = createEventDispatcher<{ closed: string }>()

const buttons: Dialog.AlertButton[] = [
  { label: 'yes, delete', action: 'delete', class: 'error-button' },
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
]

const handleDialog = (choice: string) => {
  modalIsOpen = false
  dispatch('closed', choice)
}
</script>

<span class="flex align-items-center">
  <Button disabled={isDisabled} on:click={() => (modalIsOpen = true)}>{buttonLabel}</Button>
  <InfoModal hasInfoButton content={infoModalContent} title="Some items can't be deleted" />
</span>
<Dialog.Alert
  open={modalIsOpen}
  {buttons}
  defaultAction="cancel"
  title={'Delete/Remove Coverage'}
  on:chosen={(e) => handleDialog(e.detail)}
  on:closed={handleDialog}
  >Are you sure you would like to remove coverage or delete the selected items (coverage ends at a later date)?</Dialog.Alert
>
