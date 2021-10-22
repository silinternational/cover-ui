<script lang="ts">
import user from '../../authn/user'
import { Breadcrumb, ItemDeleteModal } from 'components'
import { loading } from 'components/progress'
import { loadDependents } from 'data/dependents'
import { approveItem, deleteItem, ItemCoverageStatus, itemsByPolicyId, loadItems, PolicyItem } from 'data/items'
import { init, policies } from 'data/policies'
import { loadMembersOfPolicy } from 'data/policy-members'
import ItemDetails from 'ItemDetails.svelte'
import { ITEMS, item as itemRoute, itemEdit, itemNewClaim } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'

export let itemId: string

let open: boolean = false

$: $user.policy_id && loadItems($user.policy_id)

$: $policies.length || init()
$: policyId = $user.policy_id as string

$: isUser = $user.app_role === 'User'

// Accountable persons
$: policyId && loadDependents(policyId)

$: policyId && loadMembersOfPolicy(policyId)

$: items = $itemsByPolicyId[$user.policy_id] || []
$: item = items.find((itm) => itm.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''
$: status = (item.coverage_status || '') as ItemCoverageStatus
$: status === 'Draft' && $user.app_role === 'User' && goToEditItem()

$: allowRemoveCovereage = !['Inactive', 'Denied'].includes(status) as boolean

// Dynamic breadcrumbs data:
const itemsBreadcrumb = { name: 'Items', url: ITEMS }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: itemRoute(itemId) }
$: breadcrumbLinks = [itemsBreadcrumb, thisItemBreadcrumb]
$: itemName && (metatags.title = formatPageTitle(`Items > ${itemName}`))

const goToEditItem = () => {
  $goto(itemEdit(itemId))
}

const goToNewClaim = () => {
  $goto(itemNewClaim(itemId))
}

const handleDialog = async (event: CustomEvent<string>) => {
  open = false
  if (event.detail === 'remove') {
    await deleteItem(policyId, itemId)

    $goto(ITEMS)
  }
}

const onApproveItem = async () => {
  await approveItem(itemId)
}
</script>

<Page>
  {#if !item.id}
    {#if $loading}
      Loading...
    {:else}
      We could not find that item. Please <a href={ITEMS}>go back</a> and select an item from the list.
    {/if}
  {:else}
    <div class="flex justify-between align-items-center">
      <Breadcrumb links={breadcrumbLinks} />
      <div>
        {#if allowRemoveCovereage}
          <Button class="remove-button mx-5px" on:click={() => (open = true)}>Remove</Button>
        {/if}
        {#if status === 'Draft' || status === 'Pending'}
          <Button on:click={goToEditItem}>Edit Item</Button>
        {/if}
      </div>
    </div>
    <ItemDeleteModal {open} {item} on:closed={handleDialog} />
    <ItemDetails {item} {policyId} />
    <br />
    {#if status === 'Approved'}
      <div class="m-1">
        <Button class="mdc-theme--secondary-background" on:click={goToNewClaim} raised>File Claim</Button>
      </div>
    {:else if status === 'Pending' && !isUser}
      <div class="m-1">
        <Button class="mdc-theme--secondary-background" on:click={onApproveItem} raised>Approve Item Coverage</Button>
      </div>
    {/if}
  {/if}
</Page>
