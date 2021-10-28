<script lang="ts">
import user, { isUserSteward } from '../authn/user'
import { Claim, ClaimStatus, editableStatuses } from 'data/claims'
import { Button, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'
import Description from './Description.svelte'

export let claim = {} as Claim
export let noFilesUploaded: boolean
export let needsFile: boolean
export let isMemberOfPolicy: boolean

const dispatch = createEventDispatcher()

let message = ''
let status: ClaimStatus
$: status = claim.status

let action: string
$: switch (status) {
  case 'Review1':
    action = 'preapprove'
    break
  case 'Review2':
  case 'Review3':
    action = 'approve'
    break
  default:
    action = 'Unknown'
}

$: userIsSteward = isUserSteward($user)
$: isEditable = editableStatuses.includes(status)
$: showSubmit = ['Receipt', 'Revision'].includes(status) || (status === 'Draft' && needsFile)

const on = (eventType: string) => () => dispatch(eventType)
const onAskForChanges = () => dispatch('ask-for-changes', message)
const onFixReceipt = () => dispatch('fix-receipt', message)
const onDeny = () => dispatch('deny', message)
</script>

<style>
.container {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
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
</style>

{#if userIsSteward}
  {#if ['Review1', 'Review2', 'Review3'].includes(status)}
    <div class="container">
      <div class="text-input">
        <TextField class="w-100" label="Send a message" bind:value={message} />
        <Description>A message is required to deny or ask for changes.</Description>
      </div>
      <div class="left-buttons">
        <Button on:click={onDeny} disabled={!message} outlined>Deny</Button>
      </div>
      <div class="right-buttons">
        {#if ['Review1', 'Review3'].includes(status)}
          <Button class="mx-1" on:click={onAskForChanges} disabled={!message} raised>Ask for Changes</Button>
        {/if}
        {#if ['Review2', 'Review3'].includes(status)}
          <Button class="mx-1" on:click={onFixReceipt} disabled={!message} raised>Ask for Changes</Button>
        {/if}
        <Button on:click={on(action)} raised>{action}</Button>
      </div>
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
