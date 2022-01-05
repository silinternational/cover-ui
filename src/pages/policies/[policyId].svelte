<script lang="ts">
import { isAdmin } from 'data/user'
import { CardsGrid, ClaimsTable, Row } from 'components'
import { isLoadingById, loading } from 'components/progress'
import { Claim, claimIsOpen, loadClaimsByPolicyId, selectedPolicyClaims } from 'data/claims'
import { itemIsApproved, itemIsActive, loadItems, selectedPolicyItems, PolicyItem } from 'data/items'
import { getNameOfPolicy, loadPolicy, Policy, PolicyType, selectedPolicy } from 'data/policies'
import { roleSelection } from 'data/role-policy-selection'
import { formatDate, formatFriendlyDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import { formatPageTitle } from 'helpers/pageTitle'
import { customerClaimDetails, itemDetails, items as itemsRoute, settingsPolicy } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Button, Datatable, isAboveTablet, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string

let policy = {} as Policy
let showAllItems = false
let showAllClaims = false

onMount(async () => {
  policy = await loadPolicy(policyId)
  loadItems(policyId)
  loadClaimsByPolicyId(policyId)
})
$: policy = $selectedPolicy

$: members = policy.members || []

$: policyId && loadItems(policyId)
// sort items so inactive is last
$: items = $selectedPolicyItems
$: itemsForTable = showAllItems? $selectedPolicyItems : items.slice(0, 15)
$: allItemsBtnDisabled = itemsForTable.length >= $selectedPolicyItems.length
$: approvedItems = items.filter(itemIsApproved)

$: recentClaims = $selectedPolicyClaims.filter(isRecent)
$: claimsForTable = showAllClaims ? $selectedPolicyClaims : recentClaims.slice(0, 15)
$: claimsForGrid = isAboveTablet() ? recentClaims.slice(0, 4) : recentClaims.slice(0, 3)
$: allClaimsBtnDisabled = claimsForTable.length >= $selectedPolicyClaims.length
$: openClaimCount = recentClaims.filter(claimIsOpen).length

$: policyName = getNameOfPolicy(policy)
$: policyName && (metatags.title = formatPageTitle(`Policies > ${policyName}`))
$: coverage = formatMoney(approvedItems.reduce((sum, item) => sum + item.coverage_amount, 0))
$: premium = formatMoney(approvedItems.reduce((sum, item) => sum + item.annual_premium, 0))

const isRecent = (claim: Claim) => {
  const incidentDate = new Date(claim.incident_date)
  const today = new Date()
  const aMonthAgo = today.setMonth(today.getMonth() - 1)
  return Number(incidentDate) >= Number(aMonthAgo)
}

const onGotoClaim = (event: CustomEvent<Claim>) =>
  $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))

const onGotoPolicyItem = (event: CustomEvent<PolicyItem>) =>
  $goto(itemDetails(event.detail.policy_id, event.detail.id))
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
.subtext {
  font-weight: normal;
  font-size: small;
  padding-left: 0.5rem;
}
.bottom-padding {
  padding: 2rem;
}
.item-footer {
  margin: 1rem auto 0 auto;
  font-size: 11px;
}
</style>

<Page>
  <Row cols={'12'}>
    <CardsGrid
      isAdmin={isAdmin($roleSelection)}
      claims={claimsForGrid}
      policyItems={items}
      on:goto-claim={onGotoClaim}
      on:goto-item={onGotoPolicyItem}
    />
  </Row>

  <h3>{getNameOfPolicy($selectedPolicy)} Policy</h3>
  <div class="details">
    <table>
      <tr>
        <th>Type</th>
        <td>{policy.type}</td>
      </tr>
      {#if policy.type === PolicyType.Team}
        <tr>
          <th>Name</th>
          <td>{getNameOfPolicy(policy)}</td>
        </tr>
        <tr>
          <th>Account</th>
          <td>{policy.account || '-'}</td>
        </tr>
        <tr>
          <th>Account Detail</th>
          <td>{policy.account_detail || '-'}</td>
        </tr>
        <tr>
          <th>Cost Center</th>
          <td>{policy.cost_center || '-'}</td>
        </tr>
        <tr>
          <th>Entity Code</th>
          <td>{policy.entity_code?.code || '-'}</td>
        </tr>
      {:else if policy.type === PolicyType.Household}
        <tr>
          <th>Household ID</th>
          <td>{policy.household_id || '-'}</td>
        </tr>
      {/if}
      <tr>
        <th>Updated</th>
        <td>{formatFriendlyDate(policy.updated_at)}</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>Coverage</th><td>{coverage}</td>
      </tr>
      <tr>
        <th>Premium</th><td>{premium}/yr (2%)</td>
      </tr>
    </table>
  </div>

  <div class="flex justify-between align-items-center">
    <h4>Members</h4>
    <Button url={settingsPolicy(policyId)}>Policy Settings</Button>
  </div>
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

  <div class="flex justify-between align-items-center">
    <h4>Claims <span class="subtext">({openClaimCount} open)</span></h4>
    <Button disabled={allClaimsBtnDisabled} on:click={() => showAllClaims = true}>All Claims…</Button>
  </div>
  {#if $loading && isLoadingById(`policies/${policyId}/claims`)}
    Loading claims...
  {:else}
    <ClaimsTable claims={claimsForTable} {policyId} />
  {/if}

  <div class="flex justify-between align-items-center">
    <h4>Items <span class="subtext">({approvedItems?.length} covered)</span></h4>
    <Button disabled={allItemsBtnDisabled} on:click={() => showAllItems = true}>All Items…</Button>
  </div>
  {#if $loading && isLoadingById(`policies/${policyId}/items`)}
    Loading items...
  {:else}
    <Datatable>
      <Datatable.Header>
        <Datatable.Header.Item>Item</Datatable.Header.Item>
        <Datatable.Header.Item>Status</Datatable.Header.Item>
        <Datatable.Header.Item>Assigned To</Datatable.Header.Item>
        <Datatable.Header.Item numeric>Covered Value</Datatable.Header.Item>
        <Datatable.Header.Item numeric>Premium</Datatable.Header.Item>
        <Datatable.Header.Item>Recent Activity</Datatable.Header.Item>
      </Datatable.Header>
      <Datatable.Data>
        {#each itemsForTable as item (item.id)}
          <Datatable.Data.Row>
            <Datatable.Data.Row.Item
              ><a href={itemDetails(policyId, item.id)}>{item.name || ''}</a></Datatable.Data.Row.Item
            >
            <Datatable.Data.Row.Item>{item.coverage_status || ''}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{item.accountable_person?.name || ''}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item numeric>{formatMoney(item.coverage_amount)}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item numeric>{formatMoney(item.annual_premium)}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{formatDate(item.updated_at)}</Datatable.Data.Row.Item>
          </Datatable.Data.Row>
        {/each}
      </Datatable.Data>
    </Datatable>
    <div class="text-align-center">
      <p class="item-footer">Showing {itemsForTable.length} out of {$selectedPolicyItems.length} items</p>
      <Button url={itemsRoute(policyId)}>View {$selectedPolicyItems.length - itemsForTable.length} more items…</Button>
    </div>
  {/if}
  <div class="bottom-padding" />
</Page>
