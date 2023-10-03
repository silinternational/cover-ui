<script lang="ts">
import { BillingPeriod, PolicyItem } from 'data/items'
import type { Policy } from 'data/policies'
import { getMonthlyCheckoutMessage, getYearlyCheckoutMessage } from 'helpers/checkout'

export let item: PolicyItem | undefined = undefined
export let policy: Policy | undefined = undefined

$: householdId = policy?.household_id || ''
$: accountOrHouseholdId = householdId || policy?.account || ''
$: org = policy?.entity_code?.code
$: isMonthly = item?.billing_period === BillingPeriod.Monthly

$: monthlyCheckoutMessage = getMonthlyCheckoutMessage(item, org, accountOrHouseholdId)
$: yearlyCheckoutMessage = getYearlyCheckoutMessage(item, org, accountOrHouseholdId)
</script>

<div>
  {#if item && item.id}
    {#if isMonthly}
      {monthlyCheckoutMessage}
    {:else}
      {yearlyCheckoutMessage}
    {/if}
  {/if}
</div>
