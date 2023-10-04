<script lang="ts">
import { BillingPeriod, PolicyItem } from 'data/items'
import type { Policy } from 'data/policies'
import { getYearlyCheckoutMessage } from 'helpers/checkout'
import { formatDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

export let item: PolicyItem | undefined = undefined
export let policy: Policy | undefined = undefined

const today = new Date()
const isBeforeMonthlyCutoff = today.getUTCDate() < 20

const nextMonth = new Date()
nextMonth.setMonth(today.getMonth() + 1)
nextMonth.setDate(1)

const thirdMonth = new Date()
thirdMonth.setMonth(nextMonth.getMonth() + 1)
thirdMonth.setDate(1)

$: householdId = policy?.household_id || ''
$: accountOrHouseholdId = householdId || policy?.account || ''
$: org = policy?.entity_code?.code
$: isMonthly = item?.billing_period === BillingPeriod.Monthly

$: yearlyCheckoutMessage = getYearlyCheckoutMessage(item, org, accountOrHouseholdId)
</script>

<div>
  {#if item && item.id}
    {#if isMonthly}
      {#if isBeforeMonthlyCutoff}
        Pay {formatMoney(item.monthly_premium)} from {org} account {accountOrHouseholdId}
        each month.
      {:else}
        Pay {formatMoney(item.monthly_premium)} from {org} account {accountOrHouseholdId}
        each month, starting {formatDate(thirdMonth.toISOString())}. <br />
        <strong>NOTE:</strong> Coverage will begin {formatDate(item.coverage_start_date)}
        if this request for coverage is approved.
      {/if}
    {:else}
      {yearlyCheckoutMessage}
    {/if}
  {/if}
</div>
