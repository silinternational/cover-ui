<script lang="ts">
import ClaimCardBanner from './ClaimCardBanner.svelte'
import type { PolicyItem } from 'data/items'
import { getItemState, State } from 'data/states'
import { Card, Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'
import { differenceInSeconds, formatDistanceToNow } from 'date-fns'

export let item: PolicyItem = {} as PolicyItem
export let isAdmin: boolean

const dispatch = createEventDispatcher<{ 'goto-item': PolicyItem }>()

$: wasUpdated = differenceInSeconds(Date.parse(item.updated_at), Date.parse(item.created_at)) > 1
$: changedText = formatDistanceToNow(Date.parse(item.updated_at), { addSuffix: true })
$: state = getItemState(item.coverage_status, isAdmin) || ({} as State)
$: statusReason = item.status_reason || ''
$: showRevisionMessage = statusReason && ['Revision', 'Receipt'].includes(item.coverage_status)

const gotoItem = () => dispatch('goto-item', item)
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

<Card noPadding class="h-100 py-0 {$$props.class}">
  <ClaimCardBanner {statusReason} {state} {showRevisionMessage} />

  <div class="mdc-typography--headline5 content ml-50px">
    {item.name || ''}
  </div>

  <div class="content multi-line-truncate ml-50px">
    {item.accountable_person?.name || ''}
  </div>

  <div class="action pb-2 ml-50px" slot="actions">
    <Button raised on:click={gotoItem}>View item</Button>

    <div class="fs-12 gray mt-1">
      {#if wasUpdated}
        Last changed {changedText}
      {:else}
        No changes
      {/if}
    </div>
  </div>
</Card>
