<script lang="ts">
import CreateReportModal from '../admin/_components/CreateReportModal.svelte'
import { CardsGrid, ClaimsTable, ItemsTable, Row } from 'components'
import { month, year } from 'components/const'
import { isLoadingById, loading } from 'components/progress'
import { Claim, claimIsOpen, ClaimStatus, loadClaimsByPolicyId, selectedPolicyClaims } from 'data/claims'
import { deleteItem, itemIsApproved, itemIsActive, loadItems, selectedPolicyItems, PolicyItem } from 'data/items'
import { getNameOfPolicy, loadPolicy, Policy, PolicyType, selectedPolicy } from 'data/policies'
import { LedgerReportType } from 'data/ledger'
import { roleSelection } from 'data/role-policy-selection'
import { isAdmin } from 'data/user'
import { formatFriendlyDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import { formatPageTitle } from 'helpers/pageTitle'
import { customerClaimDetails, itemDetails, items as itemsRoute, settingsPolicy } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Button, Datatable, isAboveMobile, isAboveTablet, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string

let policy = {} as Policy
let showAllItems = false
let showAllClaims = false
let modalOpen = false
let reportDate: Date
let reportType: LedgerReportType

onMount(async () => {
  policy = await loadPolicy(policyId)
  loadItems(policyId)
  loadClaimsByPolicyId(policyId)
})
$: policy = $selectedPolicy

$: members = policy.members || []

$: policyId && loadItems(policyId)
// sort items so inactive is last
$: items = $selectedPolicyItems.filter(itemIsActive)
$: itemsForTable = showAllItems ? $selectedPolicyItems : items.slice(0, 15)
$: allItemsBtnDisabled = itemsForTable.length >= $selectedPolicyItems.length
$: approvedItems = items.filter(itemIsApproved)

$: recentClaims = $selectedPolicyClaims.filter(isRecent)
$: claimsForTable = showAllClaims ? $selectedPolicyClaims : recentClaims.slice(0, 15)
$: allClaimsBtnDisabled = claimsForTable.length >= $selectedPolicyClaims.length
$: openClaimCount = recentClaims.filter(claimIsOpen).length

$: policyName = getNameOfPolicy(policy)
$: policyName && (metatags.title = formatPageTitle(`Policies > ${policyName}`))
$: coverage = formatMoney(approvedItems.reduce((sum, item) => sum + item.coverage_amount, 0))
$: premium = formatMoney(approvedItems.reduce((sum, item) => sum + item.annual_premium, 0))
$: entityCode = policy.entity_code?.code

const isRecent = (claim: Claim) => {
  const incidentDate = new Date(claim.incident_date)
  const today = new Date()
  const aMonthAgo = today.setMonth(today.getMonth() - 1)
  return Number(incidentDate) >= Number(aMonthAgo)
}

const onGotoClaim = (event: CustomEvent<Claim>) => $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))

const onGotoPolicyItem = (event: CustomEvent<PolicyItem>) => $goto(itemDetails(event.detail.policy_id, event.detail.id))

const onDelete = async (event: CustomEvent<any>) => {
  const itemId = event.detail
  await deleteItem(policyId, itemId)

  // Depending on if the item was a draft or approved it will either be deleted or updated
  // Just reload the list for now since the delete endpoint doesn't yet tell us what happened
  loadItems(policyId)
}

const claimIsApproved = (claim: Claim) => claim.status === ClaimStatus.Approved

const claimIsWithinTimeframe = (claim: Claim) => {
  const incidentDate = new Date(claim.incident_date)
  const timeframe = reportType === LedgerReportType.monthly ? month : year
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
  const total = Number(transactions.reduce((sum, [, amount]) => sum + amount, 0)).toFixed(2)
  const csvHeader = `data:text/csv;charset=utf-8,Cover Customer ${reportType} Report,${e.detail.date},\n`
  const accountHeader =
    policy.type === PolicyType.Team
      ? `Policy Name,Account Number,Cost Center,Entity Code,\n${policyName},${policy.account},${policy.cost_center},${entityCode}`
      : `Policy Name,Household ID\n${policyName},${policy.household_id}`
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
.item-footer {
  margin: 1rem auto 0 auto;
  font-size: 11px;
}
</style>

<Page>
  <Row cols={'12'}>
    <CardsGrid
      isAdmin={isAdmin($roleSelection)}
      claims={recentClaims}
      policyItems={items}
      cardLimit={isAboveTablet() ? 4 : isAboveMobile() ? 2 : 1}
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
          <td>{entityCode || '-'}</td>
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
    <Button disabled={allClaimsBtnDisabled} on:click={() => (showAllClaims = true)}>All Claims…</Button>
  </div>
  {#if $loading && isLoadingById(`policies/${policyId}/claims`)}
    Loading claims...
  {:else}
    <ClaimsTable claims={claimsForTable} {policyId} />
  {/if}

  <div class="flex justify-between align-items-center">
    <h4>Items <span class="subtext">({approvedItems?.length} covered)</span></h4>
    <Button disabled={allItemsBtnDisabled} on:click={() => (showAllItems = true)}>All Items…</Button>
  </div>
  {#if $loading && isLoadingById(`policies/${policyId}/items`)}
    Loading items...
  {:else}
    <ItemsTable items={itemsForTable} {policyId} on:delete={onDelete} on:gotoItem={(e) => $goto(e.detail)} />
    <div class="text-align-center">
      <p class="item-footer">Showing {itemsForTable.length} out of {$selectedPolicyItems.length} items</p>
      <Button url={itemsRoute(policyId)}>View {$selectedPolicyItems.length - itemsForTable.length} more items…</Button>
    </div>
  {/if}

  <Button on:click={() => (modalOpen = true)}>download a report</Button>
  <CreateReportModal {modalOpen} on:submit={createReport} on:cancel={() => (modalOpen = false)} />

  <div class="p-2" />
</Page>
