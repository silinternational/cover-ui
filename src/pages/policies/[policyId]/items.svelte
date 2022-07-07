<script lang="ts">
import { ItemsTable, Row, SearchForm } from 'components'
import { isLoadingPolicyItems, loading } from 'components/progress'
import { cloneItems, deleteItem, deleteItems, loadItems, PolicyItem, selectedPolicyItems } from 'data/items'
import { selectedPolicyId } from 'data/role-policy-selection'
import * as routes from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'

let searchText = ''
let filteredItems = $selectedPolicyItems

$: policyId = $selectedPolicyId
$: policyId && loadItems(policyId)

$: metatags.title = formatPageTitle('Home')
$: filteredItems = $selectedPolicyItems.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))

const onDelete = async (event: CustomEvent<any>) => {
  const itemId = event.detail
  await deleteItem(policyId, itemId)

  // Depending on if the item was a draft or approved it will either be deleted or updated
  // Just reload the list for now since the delete endpoint doesn't yet tell us what happened
  loadItems(policyId)
}

const onBatchDelete = (e: CustomEvent<PolicyItem[]>) => {
  deleteItems(e.detail, policyId)
}

const onBatchClone = (e: CustomEvent<PolicyItem[]>) => {
  cloneItems(e.detail, policyId)
}

const onGotoItem = (event: CustomEvent<string>) => $goto(event.detail)

const onSearch = (event: CustomEvent<string>) => {
  if (!event.detail) {
    filteredItems = $selectedPolicyItems
  } else {
    searchText = event.detail
  }
}
</script>

<Page layout="grid">
  <Row cols={'12'}>
    <SearchForm initial={searchText} on:search={onSearch} />
    {#if $loading && isLoadingPolicyItems(policyId)}
      Loading items...
    {:else if filteredItems.length > 0}
      <ItemsTable
        items={filteredItems}
        {policyId}
        title="Items"
        on:delete={onDelete}
        on:gotoItem={onGotoItem}
        on:batchDelete={onBatchDelete}
        on:batchClone={onBatchClone}
      />
    {:else}
      <p class="m-0-auto text-align-center">You don't have any items in this policy</p>
      <p class="m-0-auto text-align-center">
        <Button class="m-1" raised prependIcon="add_circle" url={routes.itemsNew(policyId)}>Add Item</Button>
      </p>
    {/if}
  </Row>
</Page>
