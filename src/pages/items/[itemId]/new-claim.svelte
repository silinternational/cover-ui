<script>
import user from '../../../authn/user'
import { Breadcrumb, ClaimForm } from '../../../components'
import { loading } from '../../../components/progress'
import { claims, initialized, createClaim, createClaimItem, loadClaims } from '../../../data/claims.js'
import { itemsByPolicyId, loadItems } from '../../../data/items.js'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let itemId

const breadcrumbLinks = [
  {
    name: "Items",
    url: "/items",
  },
  // TODO: make this fetch the name of the item and have that as the name 
  {
    name: "This Item",
    url: `/items/${itemId}`
  },
  {
    name: "New Claim",
    url: `/items/${itemId}/new-claim`
  }
]

$: $user.policy_id && loadItems($user.policy_id)
$: items = $itemsByPolicyId[$user.policy_id] || []
$: item = items.find(itm => itm.id === itemId) || {}

$: $initialized || loadClaims()
$: existingClaim = $claims.find(claim => isItemIdOnClaim(itemId, claim)) || {}
$: claimExists = !!existingClaim.id

const isItemIdOnClaim = (itemId, claim) => {
  const claimItems = claim.claim_items || []
  return claimItems.some(claimItem => claimItem.item_id === itemId)
}
const onSubmit = async event => {
  const { claimData, claimItemData } = event.detail
  const claim = await createClaim(item, claimData)
  await createClaimItem(claim.id, claimItemData)
  $goto(`/claims/${claim.id}`)
}
</script>

<Page>
  <Breadcrumb links={breadcrumbLinks} />
  
  <!--TODO: add transitions but not after submit-->
  {#if $loading }
    <p>Loading...</p>
  {:else}
    {#if !item.id }
      <p>
        We could not find that item. Please <a href="/items">go back</a> and
        select an item from the list.
      </p>
    {:else if claimExists }
      <p>
        It looks like there is already a claim for that item. Please
        <a href="/claims/{existingClaim.id}">click here</a> to see its details.
      </p>
    {/if}
  {/if}

  <ClaimForm {item} on:submit={onSubmit} />
</Page>
