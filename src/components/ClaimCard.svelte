<script lang="ts">
import { getUploadLabel, isEvidenceNeeded } from '../business-rules/claim-payout-amount'
import ClaimBanner from './banners/ClaimBanner.svelte'
import ClaimCardBanner from './ClaimCardBanner.svelte'
import type { Claim, ClaimItem } from 'data/claims'
import type { PolicyItem } from 'data/items'
import { getClaimState, State } from 'data/states'
import { Card, Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'
import { differenceInSeconds, formatDistanceToNow } from 'date-fns'

export let claim: Claim = {} as Claim
export let claimItem: ClaimItem = {} as ClaimItem
export let isAdmin: boolean

const dispatch = createEventDispatcher<{ 'goto-claim': Claim }>()

$: item = claimItem.item || ({} as PolicyItem)
$: wasUpdated = differenceInSeconds(Date.parse(claimItem.updated_at), Date.parse(claimItem.created_at)) > 1
$: changedText = formatDistanceToNow(Date.parse(claimItem.updated_at), { addSuffix: true })
$: state = getClaimState(claim.status, isAdmin) || ({} as State)
$: statusReason = claim.status_reason || ('' as string)
$: showRevisionMessage = (statusReason && ['Revision', 'Receipt'].includes(claim.status)) as boolean
$: payoutOption = claimItem.payout_option
$: needsRepairReceipt = needsReceipt && payoutOption === 'Repair'
$: receiptType = needsRepairReceipt ? 'repair' : 'replacement'
$: needsReceipt = claim.status === 'Receipt'
$: uploadLabel = getUploadLabel(claimItem, needsReceipt, receiptType)
$: showSecondBanner = needsReceipt || isEvidenceNeeded(claimItem, claim.status)

const gotoClaim = () => dispatch('goto-claim', claim)
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

<Card noPadding class="h-300 py-0 {$$props.class}">
  <ClaimCardBanner
    class={showSecondBanner ? 'mb-0 pb-4px pt-6px' : 'mb-2'}
    {statusReason}
    {state}
    {receiptType}
    {showRevisionMessage}
  />
  {#if showSecondBanner}
    <ClaimBanner class="mb-1" claimStatus={`${claim.status}Secondary`}>
      Upload {uploadLabel} to get reimbursed.
    </ClaimBanner>
  {/if}

  <div class="mdc-typography--headline5 multi-line-truncate content ml-50px">
    {item.name || ''}
  </div>

  <div class="content multi-line-truncate ml-50px">
    {item.accountable_person?.name || ''}
  </div>

  <div class="action pb-2 ml-50px" slot="actions">
    <Button raised on:click={gotoClaim}>View claim</Button>

    <div class="fs-12 gray mt-1">
      {#if wasUpdated}
        Last changed {changedText}
      {:else}
        No changes
      {/if}
    </div>
  </div>
</Card>
