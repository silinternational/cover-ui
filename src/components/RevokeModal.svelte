<script lang="ts">
import { Claim, ClaimStatus } from 'data/claims'
import { createEventDispatcher } from 'svelte'
import { Dialog } from '@silintl/ui-components'

export let open: boolean = false
export let claim: Claim

const buttonsForSubmitted: Dialog.AlertButton[] = [
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
  { label: 'Revoke and Keep as Draft', action: 'update', class: 'mdc-dialog__button' },
  { label: 'Delete', action: 'delete', class: 'error-button' },
]
const buttonsForDraft: Dialog.AlertButton[] = [
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
  { label: 'Delete', action: 'delete', class: 'error-button' },
]

$: status = claim.status
$: buttons = status === ClaimStatus.Draft ? buttonsForDraft : buttonsForSubmitted
$: title = status === ClaimStatus.Draft ? 'Delete' : 'Revoke and Keep as Draft'
$: message =
  status === ClaimStatus.Draft
    ? `Permanently delete your claim? You can’t undo this.`
    : `Permanently revoke your claim? You can’t undo this.`

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
