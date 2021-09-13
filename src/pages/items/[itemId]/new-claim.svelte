<script lang="ts">
import user from '../../../authn/user'
import { Breadcrumb, ClaimForm } from '../../../components'
import { claims, initialized, createClaim, loadClaims } from '../../../data/claims.js'
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
$: claimExists = $claims.some(claim => isItemIdOnClaim(itemId, claim))

const isItemIdOnClaim = (itemId, claim) => {
  const claimItems = claim.claim_items || []
  return claimItems.some(claimItem => claimItem.item_id === itemId)
}
const onSubmit = async event => {
  const formData = event.detail
  await createClaim(item, formData)
  // TODO: make this go back a url
  $goto('/claims')
}
</script>

<!--TODO: add transitions but not after submit-->
{#if items && $initialized && claimExists}
  Claim already exists!
{:else if items && !item.id}
  Item does not exist!
{:else if items && $initialized}
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
    <ClaimForm {item} on:submit={onSubmit} />
  </Page>
{/if}
