<script lang="ts">
import type { Claim } from "../../data/claims"
import { initialized, loadPolicies, policies, Policy } from '../../data/policies'
import { formatFriendlyDate } from '../../helpers/date'
import { formatMoney} from '../../helpers/money'
import { Datatable, Page } from '@silintl/ui-components'
import type { PolicyMember } from "../../data/policy-members"

export let policyId: string

$: $initialized || loadPolicies()
$: policy = $policies.find(policy => policy.id === policyId) || {} as Policy
$: members = policy.members || [] as PolicyMember[]
$: claims = policy.claims || [] as Claim[]
</script>

<style>
td, th {
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
    {#if policy.type === 'Corporate' }
      <tr>
        <th>Account</th>
        <td>{policy.account}</td>
      </tr>
      <tr>
        <th>Cost Center</th>
        <td>{policy.cost_center}</td>
      </tr>
      <tr>
        <th>Entity Code</th>
        <td>{policy.entity_code?.code}</td>
      </tr>
    {:else if policy.type === 'Household' }
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
      {#each members as member (member.id) }
        <Datatable.Data.Row>
          <Datatable.Data.Row.Item>{member.first_name || ''} {member.last_name || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{member.email || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatFriendlyDate(member.last_login_utc)}</Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>

  <h4>Claims</h4>
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
      {#each claims as claim (claim.id) }
        {#each claim.claim_items as claimItem (claimItem.id) }
          <Datatable.Data.Row>
            <Datatable.Data.Row.Item>
              <a href="/claims/{claim.id}">{claim.reference_number || ''}</a>
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
        {/each}
      {:else}
        <Datatable.Data.Row>
          <Datatable.Data.Row.Item colspan="8">
            <i>None</i>
          </Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>
</Page>
