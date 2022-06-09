<script lang="ts">
import { isLoadingById, loading } from 'components/progress'
import { loadClaimsByPolicyId } from 'data/claims'
import { loadItems } from 'data/items'
import { getLedgerEntriesByPolicyId } from 'data/ledger'
import { getNameOfPolicy, loadPolicy, Policy, PolicyType, selectedPolicy } from 'data/policies'
import { selectedPolicyId } from 'data/role-policy-selection'
import { formatFriendlyDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags, params } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'
import type { Column } from 'components/Datatable/types'

export let policyId: string

const columns: Column[] = [
  { title: 'Short Name' },
  { title: 'Status Before' },
  { title: 'Status After' },
  { title: 'Type' },
  { title: 'Value' },
  { title: 'Assigned To' },
  { title: 'Location' },
]

let policy = {} as Policy
let reportData = {}
let month: ''
let year = ''

onMount(async () => {
  loadPolicy(policyId)
  loadItems(policyId)
  loadClaimsByPolicyId(policyId)
  reportData = await getLedgerEntriesByPolicyId(policyId, month, year)
})
$: month = $params.month
$: year = $params.year
$: policy = $selectedPolicy
$: $selectedPolicyId !== policyId && loadPolicy($selectedPolicyId)

$: policyId && loadItems(policyId)
$: entries = reportData.entries

$: policyName = getNameOfPolicy(policy)
$: policyName && (metatags.title = formatPageTitle(`Policies > ${policyName}`))
$: coverage = formatMoney(reportData.coverage_value)
$: premium = formatMoney(reportData.premium_total)
$: entityCode = policy.entity_code?.code
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
          <td>TODO: put some data here</td>
        </tr>
      {:else if policy.type === PolicyType.Household}
        <tr>
          <th>Household ID</th>
          <td>{policy.household_id || '-'}</td>
        </tr>
      {/if}
      <tr>
        <th>Last changed</th>
        <td>{formatFriendlyDate(reportData.last_changed)}</td>
      </tr>

      <br />

      <tr>
        <th>Coverage Value</th><td>{coverage}</td>
      </tr>
      <tr>
        <th>Premium Rate</th><td>{reportData.premium_rate}</td>
      </tr>

      <br />

      <tr>
        <th>Premium Total</th><td>{premium}/yr</td>
      </tr>
      <tr>
        <th>Payout Total</th><td>{reportData.payout_total}</td>
      </tr>
      <tr>
        <th>Net Transactions</th><td>{reportData.net_transactions}</td>
      </tr>
    </table>
  </div>

  {#if $loading && isLoadingById(`policies/${policyId}/items`)}
    Loading items...
  {:else}
    <h3>Table</h3>
    <table>
      <thead>
        <tr>
          {#each columns as column}
            <td>
              {column.title}
            </td>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each entries as entry (entry.id)}
          <tr>
            <td>{entry.item_name || ''}</td>
            <td>{entry.status_before}</td>
            <td>{entry.status_after}</td>
            <td>{formatMoney(entry.value)}</td>
            <td>{entry.assigned_to || ''}</td>
            <td>{entry.location || ''}</td>
            <td />
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}

  <div class="p-2" />
</Page>
