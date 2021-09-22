<script lang="ts">
import user from '../authn/user'
import { Claim, ClaimStatus, editableStatuses } from '../data/claims'
import { Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let claim = {} as Claim

const dispatch = createEventDispatcher()

let status: ClaimStatus
$: status = claim.status

let isEditable = false
$: isEditable = editableStatuses.includes(status)

const onEdit = () => dispatch('edit')
const onSubmit = () => dispatch('submit')
</script>

{#if $user.app_role === 'User'}
  {#if isEditable}
    <Button on:click={onEdit} outlined>Edit claim</Button>
  {/if}

  {#if status === 'Draft' || status === 'Receipt'}
    <Button raised on:click={onSubmit}>Submit claim</Button>
  {/if}
{/if}
