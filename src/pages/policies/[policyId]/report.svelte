<script lang="ts">
import { isLoadingById, loading } from 'components/progress'
import { loadClaimsByPolicyId } from 'data/claims'
import { itemIsApproved, loadItems, selectedPolicyItems, ItemCoverageStatus } from 'data/items'
import { getNameOfPolicy, loadPolicy, Policy, PolicyType, selectedPolicy } from 'data/policies'
import { selectedPolicyId } from 'data/role-policy-selection'
import { getItemState } from 'data/states'
import { formatDate, formatFriendlyDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Datatable, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'
import type { Column } from 'components/Datatable/types'

export let policyId: string

const columns: Column[] = [
  {
    title: 'Short Name',
    headerId: 'item',
    sortable: true,
  },
  {
    title: 'Status Before',
    headerId: 'status',
    sortable: true,
  },
  {
    title: 'Status After',
    headerId: 'status',
    sortable: true,
  },
  {
    title: 'Type',
    headerId: 'type',
    sortable: true,
  },
  {
    title: 'Value',
    headerId: 'covered_value',
    numeric: true,
    sortable: true,
  },
  {
    title: 'Assigned To',
    headerId: 'assigned_to',
    sortable: true,
  },
  {
    title: 'Location',
    headerId: 'location',
    sortable: true,
  },
]

let policy = {} as Policy

onMount(() => {
  loadPolicy(policyId)
  loadItems(policyId)
  loadClaimsByPolicyId(policyId)
})
$: policy = $selectedPolicy
$: $selectedPolicyId !== policyId && loadPolicy($selectedPolicyId)

$: policyId && loadItems(policyId)
$: items = $selectedPolicyItems

$: approvedItems = items.filter(itemIsApproved)

$: policyName = getNameOfPolicy(policy)
$: policyName && (metatags.title = formatPageTitle(`Policies > ${policyName}`))
$: coverage = formatMoney(approvedItems.reduce((sum, item) => sum + item.coverage_amount, 0))
$: premium = formatMoney(approvedItems.reduce((sum, item) => sum + item.annual_premium, 0))
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
        <td>{formatFriendlyDate(policy.updated_at)}</td>
      </tr>

      <br />

      <tr>
        <th>Coverage Value</th><td>{coverage}</td>
      </tr>
      <tr>
        <th>Premium Rate</th><td>2%</td>
      </tr>

      <br />

      <tr>
        <th>Premium Total</th><td>{premium}/yr</td>
      </tr>
      <tr>
        <th>Payout Total</th><td>TODO</td>
      </tr>
      <tr>
        <th>Net Transactions</th><td>TODO</td>
      </tr>
    </table>
  </div>

  {#if $loading && isLoadingById(`policies/${policyId}/items`)}
    Loading items...
  {:else}
    <h3>Table</h3>
    <Datatable>
      <Datatable.Header>
        {#each columns as column}
          <Datatable.Header.Item numeric={column.numeric} columnID={column.headerId} sortable={column.sortable}>
            {column.title}
          </Datatable.Header.Item>
        {/each}
      </Datatable.Header>
      <Datatable.Data>
        {#each items as item (item.id)}
          <Datatable.Data.Row>
            <Datatable.Data.Row.Item>{item.name || ''}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>
              {#if item.coverage_status === ItemCoverageStatus.Approved && item.coverage_end_date}
                Covered through {formatFriendlyDate(item.coverage_end_date)}
              {:else}
                {getItemState(item.coverage_status)?.title || ''}
              {/if}
            </Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>
              {#if item.coverage_status === ItemCoverageStatus.Approved && item.coverage_end_date}
                Covered through {formatFriendlyDate(item.coverage_end_date)}
              {:else}
                {getItemState(item.coverage_status)?.title || ''}
              {/if}
            </Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{item.status_change}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item numeric>{formatMoney(item.coverage_amount)}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{item.accountable_person?.name || ''}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{item.accountable_person?.country || item.country || ''}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item />
          </Datatable.Data.Row>
        {/each}
      </Datatable.Data>
    </Datatable>
  {/if}

  <div class="p-2" />
</Page>
