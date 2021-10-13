<script lang="ts">
import user from '../../../../authn/user'
import { Breadcrumb, ClaimBanner, ClaimForm } from 'components'
import { isLoadingById } from 'components/progress'
import {
  Claim,
  ClaimItem,
  claims,
  initialized,
  loadClaims,
  submitClaim,
  updateClaim,
  updateClaimItem,
} from 'data/claims'
import { itemsByPolicyId, loadItems, PolicyItem } from 'data/items'
import { HOME, CUSTOMER_CLAIMS, customerClaim, customerClaimEdit } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let claimId: string
let claimName: string

$: $initialized || loadClaims()
$: claim = $claims.find((c) => c.id === claimId) || ({} as Claim)
$: claimItems = claim.claim_items || []

/** @todo Update this when claims can have multiple items. */
$: claimItem = claimItems[0] || ({} as ClaimItem)
$: itemId = claimItem.item_id
$: claimItemId = claimItem.id

$: $user.policy_id && loadItems($user.policy_id)
$: items = $itemsByPolicyId[$user.policy_id] || []
$: item = items.find((anItem) => anItem.id === itemId) || ({} as PolicyItem)

// Dynamic breadcrumbs data:
$: item.name && claim.reference_number && (claimName = `${item.name} (${claim.reference_number})`)
const claimsBreadcrumb = { name: 'Claims', url: CUSTOMER_CLAIMS }
$: thisClaimBreadcrumb = { name: claimName || 'This item', url: customerClaim(claimId) }
const editBreadcrumb = { name: 'Edit', url: customerClaimEdit(claimId) }
$: breadcrumbLinks = [claimsBreadcrumb, thisClaimBreadcrumb, editBreadcrumb]
$: claimName && (metatags.title = formatPageTitle(`Claims > ${claimName} > Edit`))

const updateClaimAndItem = async (event: CustomEvent): Promise<void> => {
  const { claimData, claimItemData } = event.detail

  await updateClaim(claimId, claimData)
  await updateClaimItem(claimId, claimItemId, claimItemData)
}
const onSaveForLater = async (event: CustomEvent) => {
  await updateClaimAndItem(event)
  $goto(HOME)
}
const onSubmit = async (event: CustomEvent) => {
  await updateClaimAndItem(event)
  await submitClaim(claimId)
  $goto(customerClaim(claimId))
}
</script>

{#if isLoadingById(claimId)}
  Loading...
{:else if claims && !claim.id}
  We could not find that claim. Please
  <a href={CUSTOMER_CLAIMS}>go back to the list of claims</a>
  and select one from there.
{:else if items && !item.id}
  We could not find that item on this claim. Please
  <a href={CUSTOMER_CLAIMS}>go back to the list of claims</a>
  and try again.
{:else}
  <!-- @todo Handle situations where the user isn't allowed to edit this claim. -->
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
    <ClaimBanner claimStatus={'Draft'} class="my-2" />
    <ClaimForm {claim} {item} on:save-for-later={onSaveForLater} on:submit={onSubmit} />
  </Page>
{/if}
