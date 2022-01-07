<script lang="ts">
import { ItemsTable, Row } from 'components'
import { isLoadingPolicyItems, loading } from 'components/progress'
import {deleteItem, loadItems, selectedPolicyItems} from 'data/items'
import { selectedPolicyId } from 'data/role-policy-selection'
import * as routes from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

$: policyId = $selectedPolicyId

onMount(() => {
  loadItems(policyId)
})

$: metatags.title = formatPageTitle('Home')

const onDelete = async (event: CustomEvent<any>) => {
  const itemId = event.detail
  await deleteItem(policyId, itemId)

  // Depending on if the item was a draft or approved it will either be deleted or updated
  // Just reload the list for now since the delete endpoint doesn't yet tell us what happened
  loadItems(policyId)
}

const onGotoItem = (event: CustomEvent<string>) => $goto(event.detail)
</script>

<Page layout="grid">
  <Row cols={'12'}>
    {#if $loading && isLoadingPolicyItems(policyId)}
      Loading items...
    {:else if $selectedPolicyItems.length > 0}
      <ItemsTable items={$selectedPolicyItems} {policyId} title="Items" on:delete={onDelete} on:gotoItem={onGotoItem} />
    {:else}
      <p class="m-0-auto text-align-center">You don't have any items in this policy</p>
      <p class="m-0-auto text-align-center">
        <Button class="m-1" raised prependIcon="add_circle" url={routes.itemsNew(policyId)}>Add Item</Button>
      </p>
    {/if}
  </Row>
</Page>
