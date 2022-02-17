<script type="ts">
import { day } from './const'
import { Claim, ClaimStatus, selectedPolicyClaims } from 'data/claims'
import { itemIsApproved, selectedPolicyItems } from 'data/items'
import { LedgerReportType } from 'data/ledger'
import { PolicyType, Policy } from 'data/policies'
import CreateReportModal from '../pages/admin/_components/CreateReportModal.svelte'
import { createEventDispatcher } from 'svelte'

export let modalOpen = false
export let policy: Policy

let reportDate: Date
let reportType: LedgerReportType

const dispatch = createEventDispatcher<{ cancel: void }>()

const claimIsApproved = (claim: Claim) => claim.status === ClaimStatus.Approved

const claimIsWithinTimeframe = (claim: Claim) => {
  const incidentDate = new Date(claim.incident_date)
  const timeframe = reportType === LedgerReportType.monthly ? day * 30 : day * 365
  return Number(reportDate) - Number(incidentDate) <= timeframe
}

function createReport(e: CustomEvent) {
  reportType = e.detail.type
  reportDate = new Date(e.detail.date)
  const claimPayouts = $selectedPolicyClaims
    .filter(claimIsApproved)
    .filter(claimIsWithinTimeframe)
    .map((claim) => [claim.reference_number, claim.total_payout / 100])
  const premiums = $selectedPolicyItems
    .filter(itemIsApproved)
    .map((item) => [item.name, (item.prorated_annual_premium || item.annual_premium) / -100]) //this is limited to current premiums as the UI doens't see payment dates
  const transactions = [...claimPayouts, ...premiums]
  transactions.forEach((t) => (t[0] = `"${t[0]}"`))
  const total = Number(transactions.reduce((sum, [, amount]) => sum + amount, 0)).toFixed(2)
  const csvHeader = `data:text/csv;charset=utf-8,Cover Customer ${reportType} Report,${e.detail.date},\n`
  const accountHeader =
    policy.type === PolicyType.Team
      ? `Policy Name,Account Number,Cost Center,Entity Code,\n${policy.name},${policy.account},${policy.cost_center},${policy.entity_code?.code}`
      : `Policy Name,Household ID\n${policy.name},${policy.household_id}`
  const csvContent: string =
    csvHeader +
    accountHeader +
    `,\nClaim or Item, Credit/Debit,\n` +
    transactions.map((e: any) => e.join(',')).join('\n') +
    `,\nTotal,${total}`
  const encodedUri = encodeURI(csvContent)
  window.open(encodedUri)
  modalOpen = false
}
</script>

<CreateReportModal {modalOpen} on:submit={createReport} on:cancel={() => dispatch('cancel')} />
