<script lang="ts">
import type { PolicyItem } from 'data/items'
import { formatDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

export let accountOrHouseholdId: string = ''
export let item: PolicyItem | undefined = undefined
export let org: string = ''

$: annualPremium = item?.annual_premium
$: proratedAnnualPremium = item?.prorated_annual_premium || 0

$: year = new Date().getFullYear()
$: renewYear = year + 1
$: renewDate = formatDate(`${renewYear}-01-01`)
$: premiumEqualsProrated = annualPremium === proratedAnnualPremium
</script>

<span>
  {#if proratedAnnualPremium > 0}
    {#if premiumEqualsProrated}
      Pay {formatMoney(proratedAnnualPremium)} for {year} from {org} account {accountOrHouseholdId}.
    {:else}
      Pay {formatMoney(proratedAnnualPremium)} for the remainder of {year} from {org} account
      {accountOrHouseholdId}.
    {/if}
    Auto-renew and pay {formatMoney(annualPremium)} on {renewDate}.
  {:else}
    No payment needed right now. Auto-renew for {formatMoney(annualPremium)} on {renewDate}, paid from {org} account {accountOrHouseholdId}.
  {/if}
</span>
