<script lang="ts">
import user from '../authn/user'
import { Claim, ClaimStatus, editableStatuses } from 'data/claims'
import { Button, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'
import Description from './Description.svelte'

export let claim = {} as Claim

const dispatch = createEventDispatcher()

let message = ''
let status: ClaimStatus
$: status = claim.status

let isEditable: boolean
$: isEditable = editableStatuses.includes(status)

const on = (eventType) => () => dispatch(eventType)
const onAskForChanges = () => dispatch('ask-for-changes', message)
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

{#if $user.app_role === 'Steward'}
  {#if claim.status === 'Review1'}
    <div class="container">
      <div class="text-input">
        <TextField class="w-100" label="Send a message" bind:value={message} />
        <Description>A message is required to deny or ask for changes.</Description>
      </div>
      <div class="left-buttons">
        <Button on:click={onDeny} disabled={!message} outlined>Deny</Button>
      </div>
      <div class="right-buttons">
        <Button class="mx-1" on:click={onAskForChanges} disabled={!message} raised>Ask for Changes</Button>
        <Button on:click={on('preapprove')} raised>Pre-approve</Button>
      </div>
    </div>
  {/if}
{:else if $user.app_role === 'User'}
  {#if isEditable}
    <Button on:click={on('edit')} outlined>Edit claim</Button>
  {/if}

  {#if status === 'Draft' || status === 'Receipt' || status === 'Revision'}
    <Button raised on:click={on('submit')}>Submit claim</Button>
  {/if}
{/if}
