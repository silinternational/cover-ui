<script lang="ts">
import { ClaimForm } from 'components/index'
import {
  Claim,
  claims,
  createClaim,
  createClaimItem,
  initialized,
  loadClaimsByPolicyId,
  submitClaim,
} from 'data/claims'
import { itemIsApproved, loadItems, PolicyItem, selectedPolicyItems } from 'data/items'
import { selectedPolicyId } from 'data/role-policy-selection'
import { isItemActiveByDates } from 'helpers/dates'
import { formatPageTitle } from 'helpers/pageTitle'
import * as routes from 'helpers/routes'
import { assertHas } from '../../../../validation/assertions'
import { goto, metatags, redirect } from '@roxi/routify'
import { Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId = $selectedPolicyId

let itemId: string

$: items = $selectedPolicyItems.filter(itemCanClaimFilter) || []
$: item = items.find((itm) => itm.id === itemId) || ({} as PolicyItem)

$: existingClaim = $claims.find((claim) => isItemIdOnClaim(itemId, claim)) || ({} as Claim)
$: claimExists = !!existingClaim.id

$: metatags.title = formatPageTitle(`Claims > New Claim`)

onMount(async () => {
  await loadItems(policyId)
  $initialized || (await loadClaimsByPolicyId(policyId))
  if (!$selectedPolicyItems.filter(itemCanClaimFilter)) {
    setNotice('You have no items to start a claim on')
    $redirect(routes.CLAIMS)
  }
})

const isItemIdOnClaim = (itemId: string, claim: Claim) => {
  const claimItems = claim.claim_items || []
  return claimItems.some((claimItem) => claimItem.item_id === itemId)
}
const createClaimAndItem = async (event: CustomEvent): Promise<string> => {
  assertHas(!claimExists, 'There is already a claim for this item')

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

const onItemChange = (event: CustomEvent) => (itemId = event.detail.id)

const itemCanClaimFilter = (item: PolicyItem) => itemIsApproved(item) && isItemActiveByDates(item)
</script>

<Page>
  {#if claimExists}
    <p>
      It looks like there is already a claim for that item. Please
      <a href={routes.customerClaimDetails(policyId, existingClaim.id)}>click here</a> to see its details.
    </p>
  {/if}

  <h1>New claim</h1>

  <ClaimForm {item} {items} on:change={onItemChange} on:save-for-later={onSaveForLater} on:submit={onSubmit} />
</Page>
