<script lang="ts">
import type { PolicyItem } from 'data/items'
import { formatDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

export let accountOrHouseholdId: string
export let coverageStartDate: string
export let item: PolicyItem
export let org: string

const today = new Date()

const isBeforeMonthlyCutoff = today.getUTCDate() < 20

const nextMonth = new Date()
nextMonth.setMonth(today.getMonth() + 1)
nextMonth.setDate(1)

const thirdMonth = new Date()
thirdMonth.setMonth(nextMonth.getMonth() + 1)
thirdMonth.setDate(1)

$: monthlyPremium = item.monthly_premium
</script>

<span>
  {#if isBeforeMonthlyCutoff}
    Pay {formatMoney(monthlyPremium)} from {org} account {accountOrHouseholdId}
    each month.
  {:else}
    Pay {formatMoney(monthlyPremium)} from {org} account {accountOrHouseholdId}
    each month, starting {formatDate(thirdMonth.toISOString())}. <br />
    <strong>NOTE:</strong> Coverage will begin {formatDate(item.coverage_start_date)}
    if this request for coverage is approved.
  {/if}
</span>
