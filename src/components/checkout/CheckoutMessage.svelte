<script lang="ts">
import { BillingPeriod, PolicyItem } from 'data/items'
import type { Policy } from 'data/policies'
import MonthlyCheckoutMessage from './MonthlyCheckoutMessage.svelte'
import YearlyCheckoutMessage from './YearlyCheckoutMessage.svelte'

export let item: PolicyItem | undefined = undefined
export let policy: Policy | undefined = undefined

$: householdId = policy?.household_id || ''
$: accountOrHouseholdId = householdId || policy?.account || ''
$: org = policy?.entity_code?.code || ''
$: isMonthly = item?.billing_period === BillingPeriod.Monthly
</script>

<div>
  {#if item && item.id}
    {#if isMonthly}
      <MonthlyCheckoutMessage {accountOrHouseholdId} monthlyPremium={item.monthly_premium} {org} />
    {:else}
      <YearlyCheckoutMessage {accountOrHouseholdId} {item} {org} />
    {/if}
  {/if}
</div>
