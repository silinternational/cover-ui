<script lang="ts">
import user from '../../../authn/user'
import { formatDate } from 'components/dates'
import { Breadcrumb, ItemBanner, ItemForm } from 'components'
import { loading } from 'components/progress'
import { loadDependents } from 'data/dependents'
import { loadMembersOfPolicy } from 'data/policy-members'
import { deleteItem, itemsByPolicyId, loadItems, PolicyItem, submitItem, updateItem } from 'data/items'
import { getPolicyById } from 'data/policies'
import { getYear } from 'date-fns'
import { formatMoney } from 'helpers/money'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME, ITEMS, item as itemRoute, itemEdit, CUSTOMER_HOME } from 'helpers/routes'
import ItemDetails from 'ItemDetails.svelte'
import ItemDeleteModal from 'ItemDeleteModal.svelte'
import { goto, metatags } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'

export let itemId: string

let isCheckingOut: boolean = false
let open: boolean = false

$: policyId = $user.policy_id

$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)

$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []
$: item = items.find((anItem) => anItem.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''

$: policy = getPolicyById(policyId)
$: householdId = policy.household_id ? policy.household_id : ''
$: org = policy?.entity_code?.name

$: startDate = formatDate(item.coverage_start_date)
$: year = getYear(startDate)
$: renewYear = Number(year) + 1

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

const onAgreeAndPay = async () => {
  await submitItem(policyId, itemId)
  $goto(itemRoute(itemId))
}

const handleDialog = async (event: CustomEvent<string>) => {
  open = false
  if (event.detail === 'remove') {
    await deleteItem(policyId, itemId)

    $goto(ITEMS)
  }
}
</script>

<style>
.payment-header {
  background-color: var(--mdc-theme-neutral-bg);
  padding: 4px;
  border-radius: 8px 8px 0 0;
}
</style>

{#if !item.id}
  {#if $loading}
    Loading...
  {:else}
    We could not find that item. Please <a href={ITEMS}>go back</a> and select an item from the list.
  {/if}
{:else if isCheckingOut}
  <h2>Review Coverage and Checkout</h2>
  <div class="payment-header flex justify-between align-items-center">
    <Button class="mx-5px" on:click={() => (open = true)}>Discard</Button>
    <ItemDeleteModal {open} {item} on:closed={handleDialog} />

    <div>
      <Button outlined on:click={$goto(CUSTOMER_HOME)}>Save for later</Button>
      <Button raised on:click={() => (isCheckingOut = false)}>Edit Item</Button>
    </div>
  </div>
  <ItemDetails {item} {isCheckingOut} {policyId} {householdId} />
  <div class="flex p-1 mt-2">
    <div>
      Pay {formatMoney(item.prorated_annual_premium)} for the remainder of {year} from {org} account {householdId}.
      Auto-renew on 1 January {renewYear}.
    </div>
    <Button class="ml-1" raised on:click={onAgreeAndPay}>Agree and Pay {formatMoney(item.annual_premium)}</Button>
  </div>
{:else}
  <!-- @todo Handle situations where the user isn't allowed to edit this item (if any). -->
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
    <ItemBanner itemStatus="Draft" class="my-2" />
    <ItemForm {item} {policyId} on:submit={onApply} on:save-for-later={onSaveForLater} on:delete={onDelete} />
  </Page>
{/if}
