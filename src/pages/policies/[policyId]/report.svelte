<script lang="ts">
import type { Column } from 'components/Datatable/types'
import { isLoadingById, loading } from 'components/progress'
import { getLedgerEntriesByPolicyId, PolicyReportData } from 'data/ledger'
import { getNameOfPolicy, loadPolicy, Policy, PolicyType, selectedPolicy } from 'data/policies'
import { selectedPolicyId } from 'data/role-policy-selection'
import { formatFriendlyDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags, params } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string

const columns: Column[] = [
  { title: 'Item' },
  { title: 'Status', colspan: 3, centered: true },
  { title: 'Type' },
  { title: 'Amount', numeric: true },
  { title: 'Assigned To' },
  { title: 'Location' },
  { title: 'Date' },
]

let policy = {} as Policy
let reportData = {} as PolicyReportData
let today = new Date()
let month = String(today.getMonth() + 1)
let year = String(today.getFullYear())

onMount(async () => {
  loadPolicy(policyId)
  loadReportData()
})
$: policyId, loadReportData()
$: month = $params.month || month
$: year = $params.year || year
$: policy = $selectedPolicy
$: $selectedPolicyId !== policyId && loadPolicy($selectedPolicyId)

$: entries = reportData.entries || []

$: policyName = getNameOfPolicy(policy)
$: policyName && (metatags.title = formatPageTitle(`Policies > ${policyName}`))
$: entityCode = policy.entity_code?.code
$: total = entries.reduce((sum, entry) => sum + entry.value, 0)

const loadReportData = async () => {
  reportData = (await getLedgerEntriesByPolicyId(policyId, month, year)) || {}
}
</script>

<style>
.details {
  display: flex;
}
.details table:nth-child(2) {
  display: flex;
  flex-direction: column;
}
td,
th {
  padding: 0.25ex;
}

th {
  text-align: left;
}
</style>

<Page>
  <div class="details">
    <table>
      <tr>
        <th>Policy Name</th>
        <td>{getNameOfPolicy($selectedPolicy)}</td>
      </tr>
      <tr>
        <th>Policy Type</th>
        <td>{policy.type}</td>
      </tr>
      {#if policy.type === PolicyType.Team}
        <tr>
          <th>Account</th>
          <td>{entityCode} {policy.account || '-'}</td>
        </tr>
        <tr>
          <th>Cost Center</th>
          <td>{policy.cost_center || '-'}</td>
        </tr>
        <tr>
          <th>Ledger Label</th>
          <td>{policy.account_detail}</td>
        </tr>
      {:else if policy.type === PolicyType.Household}
        <tr>
          <th>Household ID</th>
          <td>{policy.household_id || '-'}</td>
        </tr>
      {/if}
      <!-- TODO: uncomment when BE finished, hide if 1/1/1 -->
      <!-- <tr>
        <th>Last changed</th>
        <td>{formatFriendlyDate(reportData.last_changed)}</td>
      </tr> -->

      <br />

      <tr>
        <th>Coverage Value</th><td>{formatMoney(reportData.coverage_value)}</td>
      </tr>
      <tr>
        <th>Premium Rate</th><td>{reportData.premium_rate * 100}%</td>
      </tr>

      <br />

      <tr>
        <th>Premium Total</th><td>{formatMoney(reportData.premium_total)}/yr</td>
      </tr>
      <tr>
        <th>Payout Total</th><td>{formatMoney(reportData.payout_total)}</td>
      </tr>
      <tr>
        <th>Net Transactions</th><td>{formatMoney(reportData.net_transactions)}</td>
      </tr>
    </table>
  </div>

  <h4>
    Report for {month}/{year}
  </h4>

  {#if $loading && isLoadingById(`policies/${policyId}/ledger-reports?month=${month}&year=${year}`)}
    Loading report...
  {:else if entries.length > 0}
    <h3>Table</h3>
    <table>
      <thead>
        <tr>
          {#each columns as column}
            <td
              colspan={column.colspan}
              class:text-align-center={column.centered}
              class:text-align-right={column.numeric}
            >
              {column.title}
            </td>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each entries as entry}
          <tr>
            <td>{entry.item_name || ''}</td>
            <td>{entry.status_before || '-'}</td>
            <td>-></td>
            <td>{entry.status_after}</td>
            <td>{entry.type}</td>
            <td>{formatMoney(entry.value)}</td>
            <td>{entry.assigned_to || ''}</td>
            <td>{entry.location || ''}</td>
            <td>{formatFriendlyDate(entry.date)}</td>
            <td />
          </tr>
        {/each}
        <tr>
          <td colspan="4" />
          <td>Total</td>
          <td>{formatMoney(total)}</td>
        </tr>
      </tbody>
    </table>
  {:else}
    <p>No relevant financial transactions</p>
  {/if}

  <div class="p-2" />
</Page>
