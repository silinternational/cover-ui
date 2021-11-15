<script lang="ts">
import { Breadcrumb, ClaimBanner, ClaimForm } from 'components'
import { isLoadingById, loading } from 'components/progress'
import {
  ClaimItem,
  claims,
  initialized,
  getClaimById,
  submitClaim,
  updateClaim,
  updateClaimItem,
  Claim,
  ClaimFormData,
} from 'data/claims'
import { loadItems, PolicyItem, selectedPolicyItems } from 'data/items'
import { selectedPolicyId } from 'data/role-policy-selection'
import { customerClaims, customerClaimDetails, customerClaimEdit } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'
import { convertToCents } from 'helpers/money'

export let claimId: string
export let policyId = $selectedPolicyId

let claimName: string

onMount(() => $initialized || getClaimById(claimId))

$: claim = ($claims.find((clm: Claim) => clm.id === claimId) || {}) as Claim
$: claimItems = claim.claim_items || []

/** @todo Update this when claims can have multiple items. */
$: claimItem = claimItems[0] || ({} as ClaimItem)
$: itemId = claimItem.item_id
$: claimItemId = claimItem.id

$: policyId && loadItems(policyId)
$: items = $selectedPolicyItems
$: item = items.find((anItem) => anItem.id === itemId) || ({} as PolicyItem)

// Dynamic breadcrumbs data:
$: item.name && claim.reference_number && (claimName = `${item.name} (${claim.reference_number})`)
const claimsBreadcrumb = { name: 'Claims', url: customerClaims(policyId) }
$: thisClaimBreadcrumb = { name: claimName || 'This item', url: customerClaimDetails(policyId, claimId) }
const editBreadcrumb = { name: 'Edit', url: customerClaimEdit(policyId, claimId) }
$: breadcrumbLinks = [claimsBreadcrumb, thisClaimBreadcrumb, editBreadcrumb]
$: claimName && (metatags.title = formatPageTitle(`Claims > ${claimName} > Edit`))

const updateClaimAndItem = async (event: CustomEvent<ClaimFormData>): Promise<void> => {
  const { claimData, claimItemData } = event.detail

  await updateClaim(claimId, {
    incident_date: new Date(claimData.lostDate).toISOString(),
    incident_type: claimData.lossReason,
    incident_description: claimData.situationDescription,
  })
  await updateClaimItem(claimId, claimItemId, {
    fmv: convertToCents(claimItemData.fairMarketValueUSD),
    is_repairable: claimItemData.isRepairable,
    payout_option: claimItemData.payoutOption,
    repair_estimate: convertToCents(claimItemData.repairEstimateUSD),
    replace_estimate: convertToCents(claimItemData.replaceEstimateUSD),
    // repair_actual: convertToCents(claimItemData.repairActual),
    // replace_actual: convertToCents(claimItemData.replaceActual),
  })
}
const onSaveForLater = async (event: CustomEvent<ClaimFormData>) => {
  await updateClaimAndItem(event)
  $goto(customerClaimDetails(policyId, claimId))
}
const onSubmit = async (event: CustomEvent<ClaimFormData>) => {
  await updateClaimAndItem(event)
  await submitClaim(claimId)
  $goto(customerClaimDetails(policyId, claimId))
}
</script>

{#if $loading && isLoadingById(`claims/${claimId}`)}
  Loading...
{:else if claims && !claim.id}
  We could not find that claim. Please
  <a href={customerClaims(policyId)}>go back to the list of claims</a>
  and select one from there.
{:else if items && !item.id}
  We could not find that item on this claim. Please
  <a href={customerClaims(policyId)}>go back to the list of claims</a>
  and try again.
{:else}
  <!-- @todo Handle situations where the user isn't allowed to edit this claim. -->
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
    <ClaimBanner claimStatus={'Draft'} class="my-2" />
    <ClaimForm {claim} {item} on:save-for-later={onSaveForLater} on:submit={onSubmit} />
  </Page>
{/if}
