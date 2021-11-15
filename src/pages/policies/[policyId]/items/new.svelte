<script lang="ts">
import Checkout from 'Checkout.svelte'
import { Breadcrumb, ItemForm } from 'components'
import { loadDependents } from 'data/dependents'
import {
  addItem,
  CreatePolicyItemRequestBody,
  deleteItem,
  ItemFormData,
  loadItems,
  PolicyItem,
  submitItem,
} from 'data/items'
import { loadMembersOfPolicy } from 'data/policy-members'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME, items as itemsRoute, itemDetails, itemsNew } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string

let isCheckingOut: boolean = false
let item: PolicyItem

onMount(() => {
  loadDependents(policyId)
  loadMembersOfPolicy(policyId)
})

$: metatags.title = formatPageTitle('Items > New')

$: policyId && loadItems(policyId)

$: breadcrumbLinks = [
  { name: 'Items', url: itemsRoute(policyId) },
  { name: 'New', url: itemsNew(policyId) },
]

const onSubmit = async (event: CustomEvent<ItemFormData>) => {
  item = await addItem(policyId, parseItemFormData(event.detail))
  isCheckingOut = true
}

const onSaveForLater = async (event: CustomEvent<ItemFormData>) => {
  await addItem(policyId, parseItemFormData(event.detail))

  $goto(HOME)
}

const onAgreeAndPay = async (event: CustomEvent<string>) => {
  const itemId = event.detail
  await submitItem(policyId, itemId)
  $goto(itemDetails(policyId, itemId))
}

const onDelete = async (event: CustomEvent<string>) => {
  await deleteItem(policyId, event.detail)
  $goto(itemsRoute(policyId))
}

const parseItemFormData = (itemData: ItemFormData): CreatePolicyItemRequestBody => {
  return {
    accountable_person_id: itemData.accountablePersonId,
    category_id: itemData.categoryId,
    country: itemData.country,
    coverage_amount: Number(itemData.marketValueUSD) * 100,
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

const onEdit = () => {
  isCheckingOut = false
}
</script>

<Page>
  {#if !isCheckingOut}
    <Breadcrumb links={breadcrumbLinks} />
    <ItemForm {item} {policyId} on:submit={onSubmit} on:save-for-later={onSaveForLater} />
  {:else}
    <Checkout {item} {policyId} on:agreeAndPay={onAgreeAndPay} on:delete={onDelete} on:edit={onEdit} />
  {/if}
</Page>
