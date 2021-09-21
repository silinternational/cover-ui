<script lang="ts">
import user from '../../../authn/user'
import { Breadcrumb, ClaimForm } from '../../../components'
import { loading } from '../../../components/progress'
import { Claim, ClaimItem, claims, initialized, loadClaims, updateClaim } from '../../../data/claims'
import { itemsByPolicyId, loadItems, PolicyItem } from '../../../data/items'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let claimId: string

const breadcrumbLinks = [
  {
    name: "Claims",
    url: "/claims",
  },
  // TODO: make this fetch the name of the item and have that as the name 
  {
    name: "This Claim",
    url: `/claims/${claimId}`
  },
  {
    name: "Edit",
    url: `/claims/${claimId}/edit`
  }
]

$: $initialized || loadClaims()
$: claim = $claims.find(c => c.id === claimId) || {} as Claim
$: claimItems = claim.claim_items || []

/** @todo Update this when claims can have multiple items. */
$: claimItem = claimItems[0] || {} as ClaimItem
$: itemId = claimItem.item_id

$: $user.policy_id && loadItems($user.policy_id)
$: items = $itemsByPolicyId[$user.policy_id] || []
$: item = items.find(anItem => anItem.id === itemId) || {} as PolicyItem

const onSubmit = async event => {
  await updateClaim(claimId, event.detail)
  $goto(`/claims/${claimId}`)
}
</script>

{#if $loading }
  Loading...
{:else if claims && !claim.id}
  We could not find that claim. Please
  <a href="/claims">go back to the list of claims</a>
  and select one from there.
{:else if items && !item.id}
  We could not find that item on this claim. Please
  <a href="/claims">go back to the list of claims</a>
  and try again.
{:else}
  <!-- @todo Handle situations where the user isn't allowed to edit this claim. -->
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
    <ClaimForm {claim} {item} on:submit={onSubmit} />
  </Page>
{/if}
