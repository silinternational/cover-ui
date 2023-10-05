<script lang="ts">
import type { PolicyItem } from 'data/items'
import { isBeforeMonthlyCutoff } from 'helpers/coverage'
import { startOfFutureMonth } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

export let accountOrHouseholdId: string
export let item: PolicyItem
export let org: string

$: monthlyPremium = item.monthly_premium
</script>

<span>
  {#if isBeforeMonthlyCutoff}
    Pay {formatMoney(monthlyPremium)} from {org} account {accountOrHouseholdId}
    each month.
  {:else}
    Pay {formatMoney(monthlyPremium)} from {org} account {accountOrHouseholdId}
    each month, starting {startOfFutureMonth(2)}. <br />
    <strong>NOTE:</strong> Coverage will begin when approved.
  {/if}
</span>
