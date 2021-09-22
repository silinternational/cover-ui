<script lang="ts">
import type { Claim } from '../data/claims'
import { Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let claim = {} as Claim

const dispatch = createEventDispatcher()

let status: string
$: status = claim.status

let isEditable: boolean = false
$: isEditable = status !== 'Approved' && status !== 'Denied' && status !== 'Paid'

const onEditClaim = () => dispatch('edit')
const onSubmitClaim = () => dispatch('submit')
</script>

{#if isEditable}
  <Button on:click={onEditClaim} outlined>Edit claim</Button>
{/if}

{#if status === 'Draft' || status === 'Receipt'}
  <Button raised on:click={onSubmitClaim}>Submit claim</Button>
{/if}
