<script lang="ts">
import { Claim, ClaimStatus, editableStatuses } from '../data/claims'
import { Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let claim = {} as Claim

const dispatch = createEventDispatcher()

let status: ClaimStatus
$: status = claim.status

let isEditable = false
$: isEditable = editableStatuses.includes(status)

const onEditClaim = () => dispatch('edit')
const onSubmitClaim = () => dispatch('submit')
</script>

{#if isEditable}
  <Button on:click={onEditClaim} outlined>Edit claim</Button>
{/if}

{#if status === 'Draft' || status === 'Receipt'}
  <Button raised on:click={onSubmitClaim}>Submit claim</Button>
{/if}
