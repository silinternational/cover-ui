<script lang="ts">
import { ItemsTable, Row, SearchForm } from 'components'
import { isLoadingPolicyItems, loading } from 'components/progress'
import {
  cloneItems,
  deleteItem,
  deleteItems,
  itemIsApproved,
  loadItems,
  PolicyItem,
  selectedPolicyItems,
} from 'data/items'
import { selectedPolicyId } from 'data/role-policy-selection'
import * as routes from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, Checkbox, Page, Switch, isAboveTablet } from '@silintl/ui-components'

let searchText = ''
let filteredItems = $selectedPolicyItems
let hideInactive = false
let approvedItems: PolicyItem[] = []

$: policyId = $selectedPolicyId
$: policyId && loadItems(policyId)

$: metatags.title = formatPageTitle('Home')
$: filteredItems = $selectedPolicyItems.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
$: approvedItems = filteredItems.filter(itemIsApproved)
$: itemsForTable = hideInactive ? approvedItems : $selectedPolicyItems

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

const hideInactiveItems = (): void => {
  hideInactive = true
}

const showInactiveItems = (): void => {
  hideInactive = false
}
</script>

<style>
.subtext {
  font-weight: normal;
  font-size: small;
  padding-left: 0.5rem;
}
</style>

<Page layout="grid">
  <Row cols={'12'}>
    <SearchForm initial={searchText} on:search={onSearch} />
    <header class="flex justify-between align-items-center">
      <h2>Items <span class="subtext">{approvedItems?.length} covered</span></h2>
      <div class="button-group tw-flex tw-gap-fl-xs">
        {#if isAboveTablet()}
          <Checkbox label="Hide Inactive" on:checked={hideInactiveItems} on:unchecked={showInactiveItems} />
        {:else}
          <Switch on:selected={hideInactiveItems} on:deselected={showInactiveItems} label="Hide Inactive" />
        {/if}
      </div>
    </header>
    {#if $loading && isLoadingPolicyItems(policyId)}
      Loading items...
    {:else if itemsForTable.length > 0}
      <ItemsTable
        items={itemsForTable}
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
