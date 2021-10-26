<script lang="ts">
import user from '../../../../authn/user'
import { Breadcrumb, ItemDeleteModal } from 'components'
import { loading } from 'components/progress'
import { formatDate } from 'components/dates'
import { loadDependents } from 'data/dependents'
import { approveItem, deleteItem, ItemCoverageStatus, itemsByPolicyId, loadItems, PolicyItem } from 'data/items'
import { init, policies } from 'data/policies'
import { loadMembersOfPolicy } from 'data/policy-members'
import { loadPolicyItemHistory, policyHistoryByItemId } from 'data/policy-history'
import ItemDetails from 'ItemDetails.svelte'
import { items as itemsRoute, itemDetails, itemEdit, itemNewClaim, POLICIES, policyDetails } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags, params } from '@roxi/routify'
import { formatDistanceToNow } from 'date-fns'
import { Button, Page, Datatable } from '@silintl/ui-components'

export let itemId: string
export let policyId: string = $params.policyId

let open: boolean = false

$: policyId && loadItems(policyId)

$: $policies.length || init()

$: isAdmin = $user.app_role === 'Steward' || $user.app_role === 'Signator'

// Accountable persons
$: policyId && loadDependents(policyId)

$: policyId && loadMembersOfPolicy(policyId)

$: items = $itemsByPolicyId[policyId] || []
$: item = items.find((itm) => itm.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''
$: status = (item.coverage_status || '') as ItemCoverageStatus
$: status === 'Draft' && $user.app_role === 'User' && goToEditItem()

$: policyId && item.id && loadPolicyItemHistory(policyId, item.id)
$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)
$: policyItemHistory = $policyHistoryByItemId[item.id]
$: hasHistory = policyItemHistory && policyItemHistory.length > 0

$: allowRemoveCovereage = !['Inactive', 'Denied'].includes(status) as boolean

// Dynamic breadcrumbs data:
$: policyName = policy.type === 'Corporate' ? policy.account : policy.household_id
$: adminBreadcrumbs = isAdmin
  ? [
      { name: 'Policies', url: POLICIES },
      { name: policyName, url: policyDetails(policyId) },
    ]
  : []
const itemsBreadcrumb = { name: 'Items', url: itemsRoute(policyId) }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: itemDetails(policyId, itemId) }
$: breadcrumbLinks = [...adminBreadcrumbs, itemsBreadcrumb, thisItemBreadcrumb]
$: itemName && (metatags.title = formatPageTitle(`Items > ${itemName}`))

const goToEditItem = () => {
  $goto(itemEdit(policyId, itemId))
}

const goToNewClaim = () => {
  $goto(itemNewClaim(policyId, itemId))
}

const handleDialog = async (event: CustomEvent<string>) => {
  open = false
  if (event.detail === 'remove') {
    await deleteItem(policyId, itemId)

    $goto(itemsRoute(policyId))
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
      We could not find that item. Please <a href={itemsRoute(policyId)}>go back</a> and select an item from the list.
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
    {:else if status === 'Pending' && isAdmin}
      <div class="m-1">
        <Button class="mdc-theme--secondary-background" on:click={onApproveItem} raised>Approve Item Coverage</Button>
      </div>
    {/if}

    {#if 0 && hasHistory}
      <h3>History</h3>
      <Datatable>
        <Datatable.Header>
          <Datatable.Header.Item>Person</Datatable.Header.Item>
          <Datatable.Header.Item>Action</Datatable.Header.Item>
          <Datatable.Header.Item>Date</Datatable.Header.Item>
        </Datatable.Header>
        <Datatable.Data>
          {#each policyItemHistory as itemHistory}
            <Datatable.Data.Row>
              <Datatable.Data.Row.Item>{itemHistory.user_id}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item
                >{itemHistory.action}
                {itemHistory.field_name} from '{itemHistory.old_value}' to '{itemHistory.new_value}'</Datatable.Data.Row.Item
              >
              <Datatable.Data.Row.Item>{formatDate(itemHistory.updated_at)}</Datatable.Data.Row.Item>
            </Datatable.Data.Row>
          {/each}
        </Datatable.Data>
      </Datatable>
    {/if}
  {/if}
</Page>
