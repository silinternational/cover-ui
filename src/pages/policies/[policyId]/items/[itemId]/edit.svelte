<script lang="ts">
import Checkout from 'Checkout.svelte'
import { Breadcrumb, ItemBanner, ItemForm } from 'components'
import { loading } from 'components/progress'
import { loadDependents } from 'data/dependents'
import { loadMembersOfPolicy } from 'data/policy-members'
import {
  deleteItem,
  ItemFormData,
  loadItems,
  PolicyItem,
  selectedPolicyItems,
  submitItem,
  updateItem,
  UpdatePolicyItemRequestBody,
} from 'data/items'
import { selectedPolicyId } from 'data/role-policy-selection'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME, items as itemsRoute, itemDetails, itemEdit } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let itemId: string
export let policyId = $selectedPolicyId

let isCheckingOut: boolean = false

onMount(() => {
  loadDependents(policyId)
  loadMembersOfPolicy(policyId)
  loadItems(policyId)
})

$: items = $selectedPolicyItems
$: item = items.find((anItem) => anItem.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''

// Dynamic breadcrumbs data:
const itemsBreadcrumb = { name: 'Items', url: itemsRoute(policyId) }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: itemDetails(policyId, itemId) }
const editBreadcrumb = { name: 'Edit', url: itemEdit(policyId, itemId) }
$: breadcrumbLinks = [itemsBreadcrumb, thisItemBreadcrumb, editBreadcrumb]
$: itemName && (metatags.title = formatPageTitle(`Items > ${itemName} > Edit`))

const onSubmit = async (event: CustomEvent<ItemFormData>) => {
  await updateItem(policyId, itemId, parseItemFormData(event.detail))
  isCheckingOut = true
}

const onSaveForLater = async (event: CustomEvent<ItemFormData>) => {
  await updateItem(policyId, itemId, parseItemFormData(event.detail))

  $goto(HOME)
}

const onDelete = async () => {
  await deleteItem(policyId, itemId)

  $goto(HOME)
}

const onAgreeAndPay = async (event: CustomEvent<string>) => {
  const itemId = event.detail
  await submitItem(policyId, itemId)
  $goto(itemDetails(policyId, itemId))
}

const onEdit = () => {
  isCheckingOut = false
}

const parseItemFormData = (itemData: ItemFormData): UpdatePolicyItemRequestBody => {
  return {
    accountable_person_id: itemData.accountablePersonId,
    category_id: itemData.categoryId,
    country: itemData.country,
    coverage_amount: Number(itemData.marketValueUSD) * 100,
    coverage_end_date: itemData.coverageEndDate || undefined,
    coverage_start_date: itemData.coverageStartDate,
    coverage_status: itemData.coverageStatus,
    description: itemData.itemDescription,
    in_storage: itemData.inStorage,
    make: itemData.make,
    model: itemData.model,
    name: itemData.shortName,
    serial_number: itemData.uniqueIdentifier,
  }
}
</script>

{#if !item.id}
  {#if $loading}
    Loading...
  {:else}
    We could not find that item. Please <a href={itemsRoute(policyId)}>go back</a> and select an item from the list.
  {/if}
{:else if isCheckingOut}
  <Checkout {item} on:agreeAndPay={onAgreeAndPay} on:delete={onDelete} on:edit={onEdit} />
{:else}
  <!-- @todo Handle situations where the user isn't allowed to edit this item (if any). -->
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
    <ItemBanner itemStatus="Draft" class="my-2" />
    <ItemForm {item} on:submit={onSubmit} on:save-for-later={onSaveForLater} on:delete={onDelete} />
  </Page>
{/if}
