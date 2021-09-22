<script lang="ts">
import ClaimCardBanner from './ClaimCardBanner.svelte'
import { day } from './const'
import type { Claim, ClaimItem } from '../data/claims'
import { getState, State } from '../data/states'
import type { PolicyItem } from '../data/items'
import { Card, Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let claim: Claim = {} as Claim
export let claimItem: ClaimItem = {} as ClaimItem
export let item: PolicyItem = {} as PolicyItem

const dispatch = createEventDispatcher()
const now = Date.now()

$: msAgo = now - Date.parse(claimItem.updated_at)
$: daysAgo = msAgo > 0 ? Math.floor(msAgo / day) : '-'
$: state = getState(claim.status) || ({} as State)
$: statusReason = claim.status_reason || ('' as string)

const gotoClaim = () => dispatch('goto-claim', claim.id)
</script>

<style>
.action {
  margin: 16px;
}

.content {
  overflow-wrap: anywhere;
  padding-bottom: 0.5rem;
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

<Card noPadding class="height-fit-content py-0 {$$props.class}">
  <ClaimCardBanner {statusReason} {state} />

  <div class="mdc-typography--headline5 multi-line-truncate content ml-50px">
    {item.name || ''}
  </div>

  <div class="content multi-line-truncate ml-50px">
    {item.accountable_person || ''}
  </div>

  <div class="action pb-2 ml-50px" slot="actions">
    <Button raised on:click={gotoClaim}>{'View claim'}</Button>

    <div class="fs-12 gray mt-1">
      {#if daysAgo}
        Last changed {daysAgo} days ago
      {:else}
        No changes
      {/if}
    </div>
  </div>
</Card>
