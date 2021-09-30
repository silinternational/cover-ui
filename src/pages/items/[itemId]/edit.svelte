<script lang="ts">
import user from '../../../authn/user'
import { Breadcrumb, ItemBanner, ItemForm } from '../../../components'
import { loading } from '../../../components/progress'
import { itemsByPolicyId, loadItems, PolicyItem, submitItem, updateItem } from '../../../data/items'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let itemId: string

$: policyId = $user.policy_id
$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []
$: item = items.find((anItem) => anItem.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''

// Dynamic breadcrumbs data:
const itemsBreadcrumb = { name: 'Items', url: '/items' }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: `/items/${itemId}` }
const editBreadcrumb = { name: 'Edit', url: `/items/${itemId}/edit` }
$: breadcrumbLinks = [itemsBreadcrumb, thisItemBreadcrumb, editBreadcrumb]

const onSubmit = async (event) => {
  await updateItem(policyId, itemId, event.detail)
  await submitItem(policyId, itemId)

  $goto(`/items/${itemId}`)
}

const onSaveForLater = async (event) => {
  await updateItem(policyId, itemId, event.detail)

  $goto('/home')
}
</script>

{#if !item.id}
  {#if $loading}
    Loading...
  {:else}
    We could not find that item. Please <a href="/items">go back</a> and select an item from the list.
  {/if}
{:else}
  <!-- @todo Handle situations where the user isn't allowed to edit this item (if any). -->
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
    <ItemBanner itemStatus="Draft" class="my-2" />
    <ItemForm {item} {policyId} on:submit={onSubmit} on:save-for-later={onSaveForLater} />
  </Page>
{/if}
