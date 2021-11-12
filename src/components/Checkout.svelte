<script lang="ts">
import { formatDate, getYear } from 'components/dates'
import type { PolicyItem } from 'data/items'
import { selectedPolicy } from 'data/policies'
import { formatMoney } from 'helpers/money'
import { CUSTOMER_HOME, TERMS_OF_SERVICE } from 'helpers/routes'
import ItemDeleteModal from 'ItemDeleteModal.svelte'
import ItemDetails from 'ItemDetails.svelte'
import { goto } from '@roxi/routify'
import { Button, Checkbox } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let item: PolicyItem
export let policyId: string

let open: boolean = false
let checked: boolean = false

$: itemId = item?.id

$: policy = $selectedPolicy
$: householdId = policy.household_id ? policy.household_id : ''
$: org = policy?.entity_code?.name

$: startDate = formatDate(item?.coverage_start_date)
$: year = getYear(startDate)
$: renewYear = Number(year) + 1
$: renewDate = formatDate(`${renewYear}-01-01`)

const dispatch = createEventDispatcher<{ agreeAndPay: string; delete: string; edit: string }>()

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
<div class="payment-header flex justify-between align-items-center pr-1">
  <Button class="mx-5px" on:click={() => (open = true)}>Discard</Button>
  <ItemDeleteModal {open} {item} on:closed={handleDialog} />

  <div>
    <Button outlined on:click={$goto(CUSTOMER_HOME)}>Save for later</Button>
    <Button raised on:click={() => dispatch('edit')}>Edit Item</Button>
  </div>
</div>
<ItemDetails {item} isCheckingOut {policyId} {householdId} />

<div class="flex align-items-center my-2">
  <Checkbox on:checked={() => (checked = true)} on:unchecked={() => (checked = false)} />

  <span class="mr-3px">I have reviewed and agree to</span><a target="_blank" href={TERMS_OF_SERVICE}>
    Terms of Service</a
  >
</div>

<div class="flex align-items-center p-1">
  <div>
    Pay {formatMoney(item.prorated_annual_premium)} for the remainder of {year} from {org} account {householdId}.
    Auto-renew and pay {formatMoney(item.annual_premium)} on {renewDate}.
  </div>
  <Button class="ml-1" disabled={!checked} raised on:click={onAgreeAndPay}>Agree and Pay</Button>
</div>
