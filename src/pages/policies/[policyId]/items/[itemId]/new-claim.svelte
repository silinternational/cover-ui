<script lang="ts">
import { Breadcrumb, ClaimForm } from 'components'
import { loading } from 'components/progress'
import { claims, initialized, createClaim, createClaimItem, loadClaims, Claim, submitClaim } from 'data/claims'
import { itemsByPolicyId, loadItems, PolicyItem } from 'data/items'
import * as routes from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags, params } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let itemId: string
export let policyId: string = $params.policyId

$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []
$: item = items.find((itm) => itm.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''

$: $initialized || loadClaims()
$: existingClaim = $claims.find((claim) => isItemIdOnClaim(itemId, claim)) || ({} as Claim)
$: claimExists = !!existingClaim.id

// Dynamic breadcrumbs data:
const itemsBreadcrumb = { name: 'Items', url: routes.items(policyId) }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: routes.itemDetails(policyId, itemId) }
const newClaimBreadcrumb = { name: 'New Claim', url: routes.itemNewClaim(policyId, itemId) }
$: breadcrumbLinks = [itemsBreadcrumb, thisItemBreadcrumb, newClaimBreadcrumb]
$: itemName && (metatags.title = formatPageTitle(`Items > ${itemName} > New Claim`))

const isItemIdOnClaim = (itemId: string, claim: Claim) => {
  const claimItems = claim.claim_items || []
  return claimItems.some((claimItem) => claimItem.item_id === itemId)
}
const createClaimAndItem = async (event: CustomEvent): Promise<string> => {
  const { claimData, claimItemData } = event.detail

  // TODO - Handle situations where the claim is created, but the claim-item
  // is rejected. We could potentially hold the claim here, and if passed in
  // the form could send the Claim ID on submit. If we receive a Claim ID here,
  // use it. Otherwise, create a new claim. */

  const claim = await createClaim(item, claimData)
  await createClaimItem(claim.id, claimItemData)
  return claim.id
}
const onSaveForLater = async (event: CustomEvent) => {
  const claimId = await createClaimAndItem(event)
  $goto(routes.customerClaimDetails(policyId, claimId))
}
const onSubmit = async (event: CustomEvent) => {
  const claimId = await createClaimAndItem(event)
  await submitClaim(claimId)
  $goto(routes.customerClaimDetails(policyId, claimId))
}
</script>

<Page>
  <!--TODO: add transitions but not after submit-->
  {#if !item.id}
    {#if $loading}
      <p>Loading...</p>
    {:else}
      <p>
        We could not find that item. Please <a href={routes.items(policyId)}>go back</a> and select an item from the list.
      </p>
    {/if}
  {:else}
    <Breadcrumb links={breadcrumbLinks} />
    {#if claimExists}
      <p>
        It looks like there is already a claim for that item. Please
        <a href={routes.customerClaimDetails(policyId, existingClaim.id)}>click here</a> to see its details.
      </p>
    {/if}

    <ClaimForm {item} on:save-for-later={onSaveForLater} on:submit={onSubmit} />
  {/if}
</Page>
