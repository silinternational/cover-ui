<script lang="ts">
import user from '../../../authn/user'
import { Breadcrumb, ClaimForm } from '../../../components'
import { loading } from '../../../components/progress'
import { claims, initialized, createClaim, createClaimItem, loadClaims, Claim, submitClaim } from '../../../data/claims'
import { itemsByPolicyId, loadItems, PolicyItem } from '../../../data/items'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let itemId: string

const breadcrumbLinks = [
  {
    name: 'Items',
    url: '/items',
  },
  // TODO: make this fetch the name of the item and have that as the name
  {
    name: 'This Item',
    url: `/items/${itemId}`,
  },
  {
    name: 'New Claim',
    url: `/items/${itemId}/new-claim`,
  },
]

$: $user.policy_id && loadItems($user.policy_id)
$: items = $itemsByPolicyId[$user.policy_id] || []
$: item = items.find((itm) => itm.id === itemId) || ({} as PolicyItem)

$: $initialized || loadClaims()
$: existingClaim = $claims.find((claim) => isItemIdOnClaim(itemId, claim)) || ({} as Claim)
$: claimExists = !!existingClaim.id

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
  $goto(`/claims/${claimId}`)
}
const onSubmit = async (event: CustomEvent) => {
  const claimId = await createClaimAndItem(event)
  await submitClaim(claimId)
  $goto(`/claims/${claimId}`)
}
</script>

<Page>
  <Breadcrumb links={breadcrumbLinks} />

  <!--TODO: add transitions but not after submit-->
  {#if $loading}
    <p>Loading...</p>
  {:else if !item.id}
    <p>
      We could not find that item. Please <a href="/items">go back</a> and select an item from the list.
    </p>
  {:else if claimExists}
    <p>
      It looks like there is already a claim for that item. Please
      <a href="/claims/{existingClaim.id}">click here</a> to see its details.
    </p>
  {/if}

  <ClaimForm {item} on:save-for-later={onSaveForLater} on:submit={onSubmit} />
</Page>
