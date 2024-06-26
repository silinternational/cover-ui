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
  ClaimStatus,
} from 'data/claims'
import { loadItems, selectedPolicyItems } from 'data/items'
import { selectedPolicyId } from 'data/role-policy-selection'
import type { PolicyItem } from 'data/types/items'
import { customerClaims, customerClaimDetails, customerClaimEdit } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let claimId: string
export let policyId = $selectedPolicyId

let claimName: string

onMount(() => {
  $initialized || getClaimById(claimId)
})

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

const updateClaimAndItem = async (event: CustomEvent): Promise<void> => {
  const { claimData, claimItemData } = event.detail

  await updateClaim(claimId, claimData)
  await updateClaimItem(claimId, claimItemId, claimItemData)
}
const onSaveForLater = async (event: CustomEvent) => {
  await updateClaimAndItem(event)
  $goto(customerClaimDetails(policyId, claimId))
}
const onSubmit = async (event: CustomEvent) => {
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
    <ClaimBanner claimStatus={ClaimStatus.Draft} class="my-2" />
    <ClaimForm {claim} {item} on:save-for-later={onSaveForLater} on:submit={onSubmit} />
  </Page>
{/if}
