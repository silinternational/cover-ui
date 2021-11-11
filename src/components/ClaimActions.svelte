<script lang="ts">
import { UserAppRole } from '../authn/user'
import {
  Claim,
  ClaimStatus,
  editableStatuses,
  PayoutOption,
  statusesAwaitingSignator,
  statusesAwaitingSteward,
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
export let receiptType: string
export let payoutOption: PayoutOption

const dispatch = createEventDispatcher()

let message = ''
let status: ClaimStatus
$: status = claim.status

$: approveButtonLabel = receiptType === 'Replacement' ? 'replace' : 'repair'

let action: string
let actionLabel: string
$: isFMVorEvacuation = payoutOption === 'FMV' || payoutOption === 'FixedFraction'
$: switch (status) {
  case 'Review1':
    action = isFMVorEvacuation ? 'approve' : 'preapprove'
    actionLabel = isFMVorEvacuation ? 'approve payout' : `okay to ${approveButtonLabel}`
    break
  case 'Review2':
    action = 'approve'
    actionLabel = 'approve payout'
    break
  case 'Review3':
    action = 'approve'
    actionLabel = 'give final approval'
    break
  default:
    action = 'error'
}

$: isEditable = editableStatuses.includes(status)
$: showSubmit = ['Receipt', 'Revision'].includes(status) || (status === 'Draft' && needsFile)
$: showLowerButtons =
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
  {#if ['Review1', 'Review2', 'Review3'].includes(status)}
    <div class="container">
      <div class="text-input">
        <TextField class="w-100" label="Send a message" bind:value={message} />
        <Description>A message is required to deny or ask for changes.</Description>
      </div>
      <div class="left-buttons">
        <Button on:click={onDeny} disabled={!message} outlined>deny</Button>
      </div>
      <div class="right-buttons">
        {#if ['Review1', 'Review3'].includes(status)}
          <Button on:click={onAskForChanges} disabled={!message} outlined>ask for changes</Button>
        {/if}
        {#if ['Review2', 'Review3'].includes(status)}
          <Button class="ml-1" on:click={onFixReceipt} disabled={!message} outlined>request a new receipt</Button>
        {/if}
      </div>
      {#if showLowerButtons}
        <div class="lower-buttons">
          <Button on:click={on(action)} raised>{actionLabel}</Button>
        </div>
      {/if}
    </div>
  {/if}
{/if}
{#if isMemberOfPolicy}
  {#if isEditable}
    <Button on:click={on('edit')} outlined>Edit claim</Button>
  {/if}

  {#if showSubmit}
    <Button raised disabled={noFilesUploaded} on:click={on('submit')}>Submit claim</Button>
  {/if}
{/if}
