<script lang="ts">
import { formatDate, getYear } from 'components/dates'
import type { PolicyItem } from 'data/items'
import { getPolicyById } from 'data/policies'
import { formatMoney } from 'helpers/money'
import { CUSTOMER_HOME } from 'helpers/routes'
import ItemDeleteModal from 'ItemDeleteModal.svelte'
import ItemDetails from 'ItemDetails.svelte'
import { goto } from '@roxi/routify'
import { Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let item: PolicyItem
export let policyId: string
export let isCheckingOut: boolean = false

let open: boolean = false

$: itemId = item?.id

$: policy = getPolicyById(policyId)
$: householdId = policy.household_id ? policy.household_id : ''
$: org = policy?.entity_code?.name

$: startDate = formatDate(item?.coverage_start_date)
$: year = getYear(startDate)
$: renewYear = Number(year) + 1

const dispatch = createEventDispatcher<{ agreeAndPay: string; delete: string }>()

const onAgreeAndPay = () => {
  dispatch('agreeAndPay', itemId)
}

const handleDialog = (event: CustomEvent<string>) => {
  open = false
  if (event.detail === 'remove') {
    dispatch('delete', itemId)
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
