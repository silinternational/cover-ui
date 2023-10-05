<script lang="ts">
import { PolicyItem } from 'data/items'
import { formatDate, getYear } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

export let accountOrHouseholdId: string = ''
export let item: PolicyItem | undefined = undefined
export let org: string = ''

$: annualPremium = item?.annual_premium
$: proratedAnnualPremium = item?.prorated_annual_premium

$: year = (new Date()).getFullYear()
$: renewYear = year + 1
$: renewDate = formatDate(`${renewYear}-01-01`)
</script>

<span>
  {#if proratedAnnualPremium > 100}
    Pay {formatMoney(proratedAnnualPremium)} for the remainder of {year} from {org} account
    {accountOrHouseholdId}. Auto-renew and pay {formatMoney(annualPremium)} on {renewDate}.
  {:else}
    No payment needed right now. Auto-renew for {formatMoney(annualPremium)} on {renewDate},
    paid from {org} account {accountOrHouseholdId}.
  {/if}
</span>
