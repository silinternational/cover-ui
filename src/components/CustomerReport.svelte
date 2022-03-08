<script lang="ts">
import CreateCustomerReportModal from './CreateCustomerReportModal.svelte'
import { Claim, ClaimStatus, selectedPolicyClaims } from 'data/claims'
import { itemIsApproved, selectedPolicyItems } from 'data/items'
import { PolicyType, Policy } from 'data/policies'
import { Button } from '@silintl/ui-components'

export let policy: Policy

let anchorEl = {} as HTMLAnchorElement
let encodedUri: string
let fileName: string
let modalOpen = false
let reportDates: { start: string; end: string }
let reportType: string

const claimIsApproved = (claim: Claim) => claim.status === ClaimStatus.Approved

const claimIsWithinTimeframe = (claim: Claim) => {
  const timeframe = Date.parse(reportDates.end) - Date.parse(reportDates.start)
  return Date.parse(reportDates.end) - Date.parse(claim.incident_date) <= timeframe
}

const getAccountHeader = (policy: Policy) => {
  return policy.type === PolicyType.Team
    ? `Policy Name,Account Number,Cost Center,Entity Code,\n${policy.name},${policy.account},${policy.cost_center},${policy.entity_code?.code}`
    : `Policy Name,Household ID,\n${policy.name},${policy.household_id}`
}

const getClaimPayouts = () => {
  return $selectedPolicyClaims
    .filter(claimIsWithinTimeframe)
    .map((claim) => [claim.reference_number, claim.total_payout / 100, claim.status, claim.payment_date.split('T')[0]])
}

const getPremiums = () => {
  return $selectedPolicyItems
    .filter(itemIsApproved)
    .map((item) => [item.name, (item.prorated_annual_premium || item.annual_premium) / -100]) //this is limited to current premiums as the UI doens't see payment dates
}

const downloadCSV = () => {
  if (anchorEl.download) {
    anchorEl.click()
  } else {
    window.open(encodedUri)
  }
}

function createReport(e: CustomEvent) {
  reportType = e.detail.type
  reportDates = e.detail.dates
  fileName = `Cover_${reportType}_Report_${reportDates.start}_${reportDates.end}.csv`
  const claimPayouts = getClaimPayouts()
  const premiums = getPremiums()
  const transactions = reportType === 'Premium' ? premiums : claimPayouts
  transactions.forEach((t) => (t[0] = `"${t[0]}"`))
  const total = Number(transactions.reduce((sum, [, amount]) => sum + amount, 0)).toFixed(2)
  const csvHeader = `data:text/csv;charset=utf-8,Cover Customer ${reportType} Report,${e.detail.dates.start} to ${e.detail.dates.end},\n`
  const accountHeader = getAccountHeader(policy)
  const claimOrItemHeader = reportType === 'Premium' ? 'Item,Premium' : 'Claim Number,Amount,Status,Payment Date'
  const csvContent: string =
    csvHeader +
    accountHeader +
    `,\n${claimOrItemHeader},\n` +
    transactions.map((e: any) => e.join(',')).join('\n') +
    `,\nTotal,${total}` +
    '\nThis report may contain data that is not finalized\n or may be different than your final statement.'
  encodedUri = encodeURI(csvContent)
  downloadCSV()
  modalOpen = false
}
</script>

<Button on:click={() => (modalOpen = true)}>download a report</Button>
<CreateCustomerReportModal {modalOpen} on:submit={createReport} on:cancel={() => (modalOpen = false)} />
<a href={encodedUri} download={fileName} bind:this={anchorEl}><div /></a>
