<script>
import ClaimCardBanner from './ClaimCardBanner.svelte'
import { day } from './const'
import { getState } from '../data/claims'
import { itemsByPolicyId, loadItems } from '../data/items'
import { Card, Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'


export let claim = {}
export let claimItem = {}

const dispatch = createEventDispatcher()
const now = Date.now()

$: policyId = claim.policy_id
$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []
$: item = items.find(i => i.id = claimItem.item_id) || {}
$: msAgo = now - Date.parse(claimItem.updated_at)
$: daysAgo = msAgo > 0 ? Math.floor(msAgo/day) : '-'
$: state = claim.status && getState(claim.status) || {}

const editClaim = () => dispatch('edit-claim', claim.id)
const gotoClaim = () => dispatch('goto-claim', claim.id)
const onKeyPress = event => {
  if (event.code === 'Space' || event.code === 'Enter') {
    gotoClaim()
  }
}
</script>

<style>
.action {
    margin: 16px;
}

.content {
  overflow-wrap: anywhere;
  padding-bottom: .5rem;
}

.multi-line-truncate {
  /* See https://stackoverflow.com/a/13924997 and https://caniuse.com/#search=line-clamp for details. */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* number of lines to show */
}

.ml-50px {
  margin-left: 50px;
}
</style>

<Card isClickable noPadding on:click={gotoClaim} on:keypress={onKeyPress} class="height-fit-content py-0 {$$props.class}">
  <ClaimCardBanner {item} {state} />

  <div class="mdc-typography--headline5 multi-line-truncate content ml-50px">
    {item.name || ''}
  </div>

  <div class="content multi-line-truncate ml-50px">
    {item.accountable_person || ''}
  </div>

  <div class="action pb-2 ml-50px" slot="actions">
    <Button raised on:click={editClaim}>{state.actionLabel || 'Edit Claim'}</Button>

    <div class="fs-12 gray mt-1">
      {#if daysAgo}
        Last changed {daysAgo} days ago
      {:else}
        No changes
      {/if}
    </div>
  </div>
</Card>
