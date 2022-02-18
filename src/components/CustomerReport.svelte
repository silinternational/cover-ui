<script type="ts">
import CreateCustomerReportModal from './CreateCustomerReportModal.svelte'
import { Claim, ClaimStatus, selectedPolicyClaims } from 'data/claims'
import { itemIsApproved, selectedPolicyItems } from 'data/items'
import { PolicyType, Policy } from 'data/policies'
import { Button } from '@silintl/ui-components'

export let policy: Policy

let reportDates: { start: string; end: string }
let reportType: string
let modalOpen = false

$: claimOrItemHeader = reportType === 'Debit' ? 'Item' : 'Claim Number'
const claimIsApproved = (claim: Claim) => claim.status === ClaimStatus.Approved

const claimIsWithinTimeframe = (claim: Claim) => {
  const timeframe = Date.parse(reportDates.end) - Date.parse(reportDates.start)
  return Date.parse(reportDates.end) - Date.parse(claim.incident_date) <= timeframe
}

function createReport(e: CustomEvent) {
  reportType = e.detail.type
  reportDates = e.detail.dates
  const claimPayouts = $selectedPolicyClaims
    .filter(claimIsApproved)
    .filter(claimIsWithinTimeframe)
    .map((claim) => [claim.reference_number, claim.total_payout / 100])
  const premiums = $selectedPolicyItems
    .filter(itemIsApproved)
    .map((item) => [item.name, (item.prorated_annual_premium || item.annual_premium) / -100]) //this is limited to current premiums as the UI doens't see payment dates
  const transactions = reportType === 'Debits' ? premiums : claimPayouts
  transactions.forEach((t) => (t[0] = `"${t[0]}"`))
  const total = Number(transactions.reduce((sum, [, amount]) => sum + amount, 0)).toFixed(2)
  const csvHeader = `data:text/csv;charset=utf-8,Cover Customer ${reportType} Report,${e.detail.dates.start} to ${e.detail.dates.end},\n`
  const accountHeader =
    policy.type === PolicyType.Team
      ? `Policy Name,Account Number,Cost Center,Entity Code,\n${policy.name},${policy.account},${policy.cost_center},${policy.entity_code?.code}`
      : `Policy Name,Household ID\n${policy.name},${policy.household_id}`
  const csvContent: string =
    csvHeader +
    accountHeader +
    `,\n${claimOrItemHeader}, ${reportType},\n` +
    transactions.map((e: any) => e.join(',')).join('\n') +
    `,\nTotal,${total}`
  const encodedUri = encodeURI(csvContent)
  window.open(encodedUri)
  modalOpen = false
}
</script>

<Button on:click={() => (modalOpen = true)}>download a report</Button>
<CreateCustomerReportModal {modalOpen} on:submit={createReport} on:cancel={() => (modalOpen = false)} />
