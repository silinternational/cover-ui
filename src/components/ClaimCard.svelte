<script lang="ts">
import { getUploadLabel, isEvidenceNeeded } from '../business-rules/claim-payout-amount'
import ClaimBanner from './banners/ClaimBanner.svelte'
import ClaimCardBanner from './ClaimCardBanner.svelte'
import { Claim, ClaimItem, ClaimStatus, PayoutOption, ReceiptType } from 'data/claims'
import { roleSelection } from 'data/role-policy-selection'
import { getClaimState, SecondaryClaimStatus, State } from 'data/states'
import type { PolicyItem } from 'data/types/items'
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
$: state = getClaimState(claim.status, $roleSelection) || ({} as State)
$: statusReason = claim.status_reason || ('' as string)
$: showRevisionMessage = (statusReason && [ClaimStatus.Revision, ClaimStatus.Receipt].includes(claim.status)) as boolean
$: payoutOption = claimItem.payout_option
$: needsRepairReceipt = needsReceipt && payoutOption === PayoutOption.Repair
$: receiptType = needsRepairReceipt ? ReceiptType.repair : ReceiptType.replacement
$: needsReceipt = claim.status === ClaimStatus.Receipt
$: uploadLabel = getUploadLabel(claimItem, needsReceipt, receiptType)
$: showNeedsFileBanner = !isAdmin && (needsReceipt || isEvidenceNeeded(claimItem, claim.status))
$: secondaryClaimStatus = `${claim.status}Secondary` as SecondaryClaimStatus

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

<Card noPadding class="py-0 h-100 {$$props.class}">
  <ClaimCardBanner
    class={showNeedsFileBanner ? 'mb-0 pb-4px pt-6px' : 'mb-2 p-1'}
    {statusReason}
    {state}
    {receiptType}
    {showRevisionMessage}
  />
  {#if showNeedsFileBanner}
    <ClaimBanner class="mb-1" claimStatus={secondaryClaimStatus}>
      Upload {uploadLabel} to get reimbursed.
    </ClaimBanner>
  {/if}

  <div class="mdc-typography--headline5 content ml-50px">
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
