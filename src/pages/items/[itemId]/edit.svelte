<script lang="ts">
import user from '../../../authn/user'
import Checkout from 'Checkout.svelte'
import { Breadcrumb, ItemBanner, ItemForm } from 'components'
import { loading } from 'components/progress'
import { loadDependents } from 'data/dependents'
import { loadMembersOfPolicy } from 'data/policy-members'
import { deleteItem, itemsByPolicyId, loadItems, PolicyItem, submitItem, updateItem } from 'data/items'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME, ITEMS, item as itemRoute, itemEdit } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let itemId: string

let isCheckingOut: boolean = false

$: policyId = $user.policy_id

$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)

$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []
$: item = items.find((anItem) => anItem.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''

// Dynamic breadcrumbs data:
const itemsBreadcrumb = { name: 'Items', url: ITEMS }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: itemRoute(itemId) }
const editBreadcrumb = { name: 'Edit', url: itemEdit(itemId) }
$: breadcrumbLinks = [itemsBreadcrumb, thisItemBreadcrumb, editBreadcrumb]
$: itemName && (metatags.title = formatPageTitle(`Items > ${itemName} > Edit`))

const onApply = async (event: CustomEvent) => {
  await updateItem(policyId, itemId, event.detail)
  isCheckingOut = true
}

const onSaveForLater = async (event: CustomEvent) => {
  await updateItem(policyId, itemId, event.detail)

  $goto(HOME)
}

const onDelete = async () => {
  await deleteItem(policyId, itemId)

  $goto(HOME)
}

const onAgreeAndPay = async (event: CustomEvent<string>) => {
  const itemId = event.detail
  await submitItem(policyId, itemId)
  $goto(itemRoute(itemId))
}

const onEdit = () => {
  isCheckingOut = false
}
</script>

{#if !item.id}
  {#if $loading}
    Loading...
  {:else}
    We could not find that item. Please <a href={ITEMS}>go back</a> and select an item from the list.
  {/if}
{:else if isCheckingOut}
  <Checkout {item} {policyId} on:agreeAndPay={onAgreeAndPay} on:delete={onDelete} on:edit={onEdit} />
{:else}
  <!-- @todo Handle situations where the user isn't allowed to edit this item (if any). -->
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
    <ItemBanner itemStatus="Draft" class="my-2" />
    <ItemForm {item} {policyId} on:submit={onApply} on:save-for-later={onSaveForLater} on:delete={onDelete} />
  </Page>
{/if}
