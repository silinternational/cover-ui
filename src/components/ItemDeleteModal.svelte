<script lang="ts">
import { Dialog } from '@silintl/ui-components'
import { ItemCoverageStatus, type PolicyItem } from 'data/items'
import { createEventDispatcher } from 'svelte'

export let open = true
export let item: PolicyItem

const dispatch = createEventDispatcher<{ closed: string }>()

const buttons: Dialog.AlertButton[] = [
  { label: 'Yes, Remove', action: 'remove', class: 'error-button' },
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
]

$: status = item.coverage_status
$: title = status === ItemCoverageStatus.Draft ? 'Delete' : 'Remove Coverage'
$: message =
  status === ItemCoverageStatus.Draft
    ? `Are you sure you would like to delete ${item.name}?`
    : `Are you sure you would like to remove coverage for ${item.name}?`

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
