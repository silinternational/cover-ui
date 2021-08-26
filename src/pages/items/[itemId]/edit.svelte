<script>
import user from '../../../authn/user'
import { Breadcrumb, ItemForm } from '../../../components'
import { loading } from '../../../components/progress'
import { itemsByPolicyId, loadItems, updateItem } from '../../../data/items.js'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let itemId

const breadcrumbLinks = [
  {
    name: "Items",
    url: "/items",
  },
  // TODO: make this fetch the name of the item and have that as the name 
  {
    name: "This Item",
    url: `/items/${itemId}`
  },
  {
    name: "Edit",
    url: `/items/${itemId}/edit`
  }
]

$: policyId = $user.policy_id
$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []
$: item = items.find(anItem => anItem.id === itemId) || {}

const onSubmit = async event => {
  await updateItem(policyId, event.detail)
  $goto(`/items/${itemId}`)
}
const onSaveForLater = async event => {
  /* @todo Save this as an item draft. */
  console.log('Save-for-later form data', event.detail)

  $goto(`/items/${itemId}`)
}
</script>

{#if !item.id }
  {#if $loading}
    Loading...
  {:else}
    We could not find that item. Please <a href="/items">go back</a> and select
    an item from the list.
  {/if}
{:else}
  <!-- @todo Handle situations where the user isn't allowed to edit this item (if any). -->
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
    <ItemForm {item} {policyId} on:submit={onSubmit} on:save-for-later={onSaveForLater} />
  </Page>
{/if}
