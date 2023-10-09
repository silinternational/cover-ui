<script lang="ts">
import type { PolicyItem } from 'data/items'
import { formatDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

export let accountOrHouseholdId: string = ''
export let item: PolicyItem | undefined = undefined
export let org: string = ''

$: annualPremium = item?.annual_premium
$: proratedAnnualPremiumOrMin = Math.max(item?.prorated_annual_premium || 0, item?.category?.minimum_premium || 0)

$: year = new Date().getFullYear()
$: renewYear = year + 1
$: renewDate = formatDate(`${renewYear}-01-01`)
$: premiumEqualsProrated = annualPremium === proratedAnnualPremiumOrMin
</script>

<span>
  Pay {formatMoney(proratedAnnualPremiumOrMin)}
  {premiumEqualsProrated ? 'for' : 'for the remainder of'}
  {year} from {org} account
  {accountOrHouseholdId}. Auto-renew and pay {formatMoney(annualPremium)} on {renewDate}.
</span>
