<script lang="ts">
import type { Claim } from '../data/claims'
import { Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let claim = {} as Claim

const dispatch = createEventDispatcher()

const onEditClaim = () => dispatch('edit')
const onSubmitClaim = () => dispatch('submit')
</script>

<Button on:click={onEditClaim} outlined>Edit claim</Button>

{#if claim.status === 'Draft' }
  <Button raised on:click={onSubmitClaim}>Submit claim</Button>
{/if}
