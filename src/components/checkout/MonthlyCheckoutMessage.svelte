<script lang="ts">
import type { PolicyItem } from 'data/items'
import { isBeforeMonthlyCutoff } from 'helpers/coverage'
import { formatDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

export let accountOrHouseholdId: string
export let item: PolicyItem
export let org: string

const today = new Date()

const thirdMonth = new Date()
thirdMonth.setMonth(today.getMonth() + 2)
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
    <strong>NOTE:</strong> Coverage will begin when approved.
  {/if}
</span>
