<script lang="ts">
import { BillingPeriod, PolicyItem } from 'data/items'
import type { Policy } from 'data/policies'
import { getYearlyCheckoutMessage } from 'helpers/checkout'
import MonthlyCheckoutMessage from "components/checkout/MonthlyCheckoutMessage.svelte";

export let item: PolicyItem | undefined = undefined
export let policy: Policy | undefined = undefined

$: householdId = policy?.household_id || ''
$: accountOrHouseholdId = householdId || policy?.account || ''
$: org = policy?.entity_code?.code || ''
$: isMonthly = item?.billing_period === BillingPeriod.Monthly

$: yearlyCheckoutMessage = getYearlyCheckoutMessage(item, org, accountOrHouseholdId)
</script>

<div>
  {#if item && item.id}
    {#if isMonthly}
      <MonthlyCheckoutMessage {accountOrHouseholdId} monthlyPremium={item.monthly_premium} {org} />
    {:else}
      {yearlyCheckoutMessage}
    {/if}
  {/if}
</div>
