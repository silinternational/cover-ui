<script lang="ts">
import { CardsGrid, ItemsTable, Row } from 'components'
import { isLoadingPolicyItems, loading } from 'components/progress'
import { Claim, loadClaimsByPolicyId, selectedPolicyClaims } from 'data/claims'
import { deleteItem, loadItems, PolicyItem, selectedPolicyItems } from 'data/items'
import { getNameOfPolicy, selectedPolicy } from 'data/policies'
import { selectedPolicyId } from 'data/role-policy-selection'
import * as routes from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

$: policyId = $selectedPolicyId
$: items = $selectedPolicyItems.filter((item) => item.coverage_status !== 'Inactive')

onMount(() => {
  loadItems(policyId)
  loadClaimsByPolicyId(policyId)
})

$: metatags.title = formatPageTitle('Home')

const onDelete = async (event: CustomEvent<any>) => {
  const itemId = event.detail
  await deleteItem(policyId, itemId)

  // Depending on if the item was a draft or approved it will either be deleted or updated
  // Just reload the list for now since the delete endpoint doesn't yet tell us what happened
  loadItems(policyId)
}

const onGotoClaim = (event: CustomEvent<Claim>) =>
  $goto(routes.customerClaimDetails(event.detail.policy_id, event.detail.id))

const onGotoPolicyItem = (event: CustomEvent<PolicyItem>) =>
  $goto(routes.itemDetails(event.detail.policy_id, event.detail.id))

const onGotoItem = (event: CustomEvent<string>) => $goto(event.detail)
</script>

<Page layout="grid">
  <Row cols={'12'}>
    <h3>{getNameOfPolicy($selectedPolicy)} Policy</h3>
    <CardsGrid
      claims={$selectedPolicyClaims}
      policyItems={items}
      on:goto-claim={onGotoClaim}
      on:goto-item={onGotoPolicyItem}
    />
  </Row>

  <Row cols={'12'}>
    {#if $selectedPolicyItems.length > 0}
      <ItemsTable {items} {policyId} on:delete={onDelete} on:gotoItem={onGotoItem} />
    {:else if $loading && isLoadingPolicyItems(policyId)}
      Loading items...
    {:else}
      <p class="text-align-center">You don't have any items in this policy</p>
      <p class="text-align-center">
        <Button class="m-1" raised prependIcon="add_circle" url={routes.itemsNew(policyId)}>Add Item</Button>
      </p>
    {/if}
  </Row>
</Page>
