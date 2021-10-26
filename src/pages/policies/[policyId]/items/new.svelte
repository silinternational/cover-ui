<script lang="ts">
import Checkout from 'Checkout.svelte'
import { Breadcrumb, ItemForm } from 'components'
import { loadDependents } from 'data/dependents'
import { addItem, deleteItem, loadItems, PolicyItem, submitItem } from 'data/items'
import { loadMembersOfPolicy } from 'data/policy-members'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME, items as itemsRoute, itemDetails, itemsNew } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let policyId: string

let isCheckingOut: boolean = false
let item: PolicyItem

$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)
$: metatags.title = formatPageTitle('Items > New')

$: policyId && loadItems(policyId)

$: breadcrumbLinks = [
  { name: 'Items', url: itemsRoute(policyId) },
  { name: 'New', url: itemsNew(policyId) },
]

const onApply = async (event: CustomEvent) => {
  item = await addItem(policyId, event.detail)
  isCheckingOut = true
}

const onSaveForLater = async (event: CustomEvent) => {
  await addItem(policyId, event.detail)

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

const onEdit = () => {
  isCheckingOut = false
}
</script>

<Page>
  {#if !isCheckingOut}
    <Breadcrumb links={breadcrumbLinks} />
    <ItemForm {item} {policyId} on:submit={onApply} on:save-for-later={onSaveForLater} />
  {:else}
    <Checkout {item} {policyId} on:agreeAndPay={onAgreeAndPay} on:delete={onDelete} on:edit={onEdit} />
  {/if}
</Page>
