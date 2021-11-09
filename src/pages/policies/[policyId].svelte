<script lang="ts">
import { getNameOfPolicy, loadPolicy, Policy } from 'data/policies'
import { loadItems, selectedPolicyItems } from 'data/items'
import type { PolicyMember } from 'data/policy-members'
import { getAccountablePerson, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { dependentsByPolicyId } from 'data/dependents'
import { formatDate } from 'components/dates'
import { isLoadingById, loading } from 'components/progress'
import { formatFriendlyDate } from 'helpers/date'
import { formatMoney } from 'helpers/money'
import { customerClaimDetails, itemDetails } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Datatable, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string

let policy = {} as Policy

onMount(async () => {
  policy = await loadPolicy(policyId)
})

$: members = policy.members || ([] as PolicyMember[])
$: policyMemberOptions = getPolicyMemberOptions(members)
$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions]

$: policyId && loadItems(policyId)
$: items = $selectedPolicyItems
$: claims = policy.claims || []
$: policyName = policy.type === 'Team' ? policy.account_detail : policy.household_id
$: policyName && (metatags.title = formatPageTitle(`Policies > ${policyName}`))
</script>

<style>
td,
th {
  padding: 0.25ex;
}

th {
  text-align: left;
}
</style>

<Page>
  <h3>Policy</h3>
  <table>
    <tr>
      <th>Type</th>
      <td>{policy.type}</td>
    </tr>
    {#if policy.type === 'Team'}
      <tr>
        <th>Name</th>
        <td>{getNameOfPolicy(policy)}</td>
      </tr>
      <tr>
        <th>Account</th>
        <td>{policy.account}</td>
      </tr>
      <tr>
        <th>Account Detail</th>
        <td>{policy.account_detail}</td>
      </tr>
      <tr>
        <th>Cost Center</th>
        <td>{policy.cost_center}</td>
      </tr>
      <tr>
        <th>Entity Code</th>
        <td>{policy.entity_code?.code}</td>
      </tr>
    {:else if policy.type === 'Household'}
      <tr>
        <th>Household ID</th>
        <td>{policy.household_id}</td>
      </tr>
    {/if}
    <tr>
      <th>Updated</th>
      <td>{formatFriendlyDate(policy.updated_at)}</td>
    </tr>
  </table>

  <h4>Members</h4>
  <Datatable>
    <Datatable.Header>
      <Datatable.Header.Item>Name</Datatable.Header.Item>
      <Datatable.Header.Item>Email</Datatable.Header.Item>
      <Datatable.Header.Item>Last Login</Datatable.Header.Item>
    </Datatable.Header>
    <Datatable.Data>
      {#each members as member (member.id)}
        <Datatable.Data.Row>
          <Datatable.Data.Row.Item>{member.first_name || ''} {member.last_name || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{member.email || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatFriendlyDate(member.last_login_utc)}</Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>

  <h4>Items</h4>
  {#if $loading && isLoadingById(`policies/${policyId}/items`)}
    Loading items...
  {:else}
    <Datatable>
      <Datatable.Header>
        <Datatable.Header.Item>Item</Datatable.Header.Item>
        <Datatable.Header.Item>Accountable Person</Datatable.Header.Item>
        <Datatable.Header.Item>Covered Value</Datatable.Header.Item>
        <Datatable.Header.Item>Premium</Datatable.Header.Item>
        <Datatable.Header.Item>Recent Activity</Datatable.Header.Item>
      </Datatable.Header>
      <Datatable.Data>
        {#each items as item (item.id)}
          <Datatable.Data.Row>
            <Datatable.Data.Row.Item
              ><a href={itemDetails(policyId, item.id)}>{item.name || ''}</a> ({item.coverage_status ||
                ''})</Datatable.Data.Row.Item
            >
            <Datatable.Data.Row.Item
              >{getAccountablePerson(item, accountablePersons).name || ''}</Datatable.Data.Row.Item
            >
            <Datatable.Data.Row.Item>{formatMoney(item.coverage_amount)}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{formatMoney(item.annual_premium)}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{formatDate(item.updated_at)}</Datatable.Data.Row.Item>
          </Datatable.Data.Row>
        {/each}
      </Datatable.Data>
    </Datatable>
  {/if}

  <h4>Claims</h4>
  {#if $loading && isLoadingById(`policies/${policyId}/claims`)}
    Loading claims...
  {:else}
    <Datatable>
      <Datatable.Header>
        <Datatable.Header.Item>Reference #</Datatable.Header.Item>
        <Datatable.Header.Item>Incident Date</Datatable.Header.Item>
        <Datatable.Header.Item>Status</Datatable.Header.Item>
        <Datatable.Header.Item>Repairable</Datatable.Header.Item>
        <Datatable.Header.Item>Payout Option</Datatable.Header.Item>
        <Datatable.Header.Item>Repair</Datatable.Header.Item>
        <Datatable.Header.Item>Replacement</Datatable.Header.Item>
        <Datatable.Header.Item>FMV</Datatable.Header.Item>
      </Datatable.Header>
      <Datatable.Data>
        {#each claims as claim (claim.id)}
          {#each claim.claim_items as claimItem (claimItem.id)}
            <Datatable.Data.Row>
              <Datatable.Data.Row.Item>
                <a href={customerClaimDetails(policyId, claim.id)}>{claim.reference_number || ''}</a>
                ({claim.status})
              </Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{formatFriendlyDate(claim.incident_date)}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{claimItem.status || ''}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{claimItem.is_repairable ? 'Yes' : 'No'}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{claimItem.payout_option || ''}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{formatMoney(claimItem.repair_estimate)}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{formatMoney(claimItem.replace_estimate)}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{formatMoney(claimItem.fmv)}</Datatable.Data.Row.Item>
            </Datatable.Data.Row>
          {:else}
            <Datatable.Data.Row>
              <Datatable.Data.Row.Item>
                <a href={customerClaimDetails(policyId, claim.id)}>{claim.reference_number || ''}</a>
                ({claim.status})
              </Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{formatFriendlyDate(claim.incident_date)}</Datatable.Data.Row.Item>
            </Datatable.Data.Row>
          {/each}
        {:else}
          <Datatable.Data.Row>
            <Datatable.Data.Row.Item colspan={8}>
              <i>None</i>
            </Datatable.Data.Row.Item>
          </Datatable.Data.Row>
        {/each}
      </Datatable.Data>
    </Datatable>
  {/if}
</Page>
