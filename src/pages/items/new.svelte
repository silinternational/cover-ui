<script lang="ts">
import user from '../../authn/user'
import { Breadcrumb, ItemForm } from 'components'
import { formatDate, getYear } from 'components/dates'
import { loadDependents } from 'data/dependents'
import { addItem, deleteItem, loadItems, PolicyItem, submitItem } from 'data/items'
import { loadMembersOfPolicy } from 'data/policy-members'
import { getPolicyById } from 'data/policies'
import { formatMoney } from 'helpers/money'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME, ITEMS, item as itemRoute, CUSTOMER_HOME } from 'helpers/routes'
import ItemDeleteModal from 'ItemDeleteModal.svelte'
import ItemDetails from 'ItemDetails.svelte'
import { goto, metatags } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'

let isCheckingOut: boolean = false
let open: boolean = false
let item: PolicyItem

$: policyId = $user.policy_id

$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)
$: metatags.title = formatPageTitle('Items > New')

$: policyId && loadItems(policyId)
$: itemId = item?.id

$: policy = getPolicyById(policyId)
$: householdId = policy.household_id ? policy.household_id : ''
$: org = policy?.entity_code?.name

$: startDate = formatDate(item?.coverage_start_date)
$: year = getYear(startDate)
$: renewYear = Number(year) + 1

const onApply = async (event: CustomEvent) => {
  item = await addItem(policyId, event.detail)
  isCheckingOut = true
}

const onSaveForLater = async (event: CustomEvent) => {
  await addItem(policyId, event.detail)

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

<Page>
  {#if !isCheckingOut}
    <Breadcrumb />
    <ItemForm {item} {policyId} on:submit={onApply} on:save-for-later={onSaveForLater} />
  {:else}
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
  {/if}
</Page>
