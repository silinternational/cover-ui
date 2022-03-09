<script lang="ts">
import { UserAppRole } from 'data/user'
import { MAX_TEXT_AREA_LENGTH as maxlength } from 'components/const'
import {
  Claim,
  ClaimStatus,
  editableStatuses,
  PayoutOption,
  statusesAvaitingAdmin,
  statusesAwaitingSignator,
  statusesAwaitingSteward,
  ReceiptType,
} from 'data/claims'
import { roleSelection } from 'data/role-policy-selection'
import Description from './Description.svelte'
import { throwError } from '../error'
import { Button, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let claim = {} as Claim
export let noFilesUploaded: boolean
export let needsFile: boolean
export let isMemberOfPolicy: boolean
export let isAdmin: boolean
export let receiptType: ReceiptType
export let payoutOption: PayoutOption

const dispatch = createEventDispatcher()

let message = ''
let status: ClaimStatus
$: status = claim.status

$: approveButtonLabel = receiptType === ReceiptType.repair ? ReceiptType.repair : 'replace'

let action: string
let actionLabel: string
$: isFMVorEvacuation = payoutOption === PayoutOption.FMV || payoutOption === PayoutOption.FixedFraction
$: switch (status) {
  case ClaimStatus.Review1:
    action = isFMVorEvacuation ? 'approve' : 'preapprove'
    actionLabel = isFMVorEvacuation ? 'approve payout' : `okay to ${approveButtonLabel}`
    break
  case ClaimStatus.Review2:
    action = 'approve'
    actionLabel = 'approve payout'
    break
  case ClaimStatus.Review3:
    action = 'approve'
    actionLabel = 'give final approval'
    break
  default:
    action = 'error'
}

$: isEditable = editableStatuses.includes(status)
$: showSubmit = status === ClaimStatus.Draft && needsFile
$: showApprovalButton =
  (statusesAwaitingSteward.includes(status) && $roleSelection === UserAppRole.Steward) ||
  (statusesAwaitingSignator.includes(status) && $roleSelection === UserAppRole.Signator)

const on = (eventType: string) => () => {
  eventType !== 'error' ? dispatch(eventType) : throwError(`An error has occured due to unkown status ${status}`)
}
const onAskForChanges = () => dispatch('ask-for-changes', message)
const onFixReceipt = () => dispatch('fix-receipt', message)
const onDeny = () => dispatch('deny', message)
</script>

<style>
.container {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  row-gap: 1rem;
}
.text-input {
  grid-column: 1 / span 2;
  grid-row-start: 1;
}
.left-buttons {
  grid-column-start: 1;
  grid-row-start: 2;
}
.right-buttons {
  grid-column-start: 2;
  grid-row-start: 2;
  text-align: right;
}
.lower-buttons {
  grid-column-start: 2;
  grid-row-start: 3;
  text-align: right;
}
</style>

{#if isAdmin}
  {#if statusesAvaitingAdmin.includes(status)}
    <div class="container">
      <div class="text-input">
        <TextField {maxlength} class="w-100" label="Send a message" bind:value={message} />
        <Description>A message is required to deny or ask for changes.</Description>
      </div>
      <div class="left-buttons">
        <Button on:click={onDeny} disabled={!message} outlined>deny</Button>
      </div>
      <div class="right-buttons">
        {#if [ClaimStatus.Review1, ClaimStatus.Review3].includes(status)}
          <Button on:click={onAskForChanges} disabled={!message} outlined>ask for changes</Button>
        {/if}
        {#if [ClaimStatus.Review2, ClaimStatus.Review3].includes(status) && !isFMVorEvacuation}
          <Button class="ml-1" on:click={onFixReceipt} disabled={!message} outlined>request a new receipt</Button>
        {/if}
      </div>
      {#if showApprovalButton}
        <div class="lower-buttons">
          <Button on:click={on(action)} raised>{actionLabel}</Button>
        </div>
      {/if}
    </div>
  {/if}
{/if}
{#if isMemberOfPolicy}
  {#if isEditable}
    <Button raised on:click={on('edit')}>edit claim</Button>
    <Button outlined on:click={on('delete')}><span class="material-icons">delete</span></Button>
  {/if}

  {#if showSubmit}
    <Button raised disabled={noFilesUploaded} on:click={on('submit')}>Submit claim</Button>
  {/if}
{/if}
