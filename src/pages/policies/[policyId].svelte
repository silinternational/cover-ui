<script lang="ts">
import { Breadcrumb, CardsGrid, ClaimsTable, ItemsTable, Row, Strikes, CustomerReport } from 'components'
import { isLoadingById, loading } from 'components/progress'
import Switch from '../../components/mdc/Switch'
import { Claim, claimIsOpen, loadClaimsByPolicyId, selectedPolicyClaims } from 'data/claims'
import {
  deleteItem,
  itemIsApproved,
  loadItems,
  selectedPolicyItems,
  PolicyItem,
  deleteItems,
  cloneItems,
} from 'data/items'
import { getNameOfPolicy, loadPolicy, Policy, PolicyType, selectedPolicy } from 'data/policies'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'
import { isAdmin } from 'data/user'
import { formatFriendlyDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import { formatPageTitle } from 'helpers/pageTitle'
import {
  customerClaimDetails,
  itemDetails,
  items as itemsRoute,
  POLICIES,
  policyDetails,
  settingsPolicy,
} from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Button, Checkbox, Datatable, isAboveMobile, isAboveTablet, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string

let policy = {} as Policy
let showAllClaims = false
let checkedItems = [] as PolicyItem[]
let hideInactive = false

onMount(() => {
  loadPolicy(policyId)
  loadItems(policyId)
  loadClaimsByPolicyId(policyId)
})
$: policy = $selectedPolicy
$: $selectedPolicyId !== policyId && loadPolicy($selectedPolicyId)

$: members = policy.members || []

$: policyId && loadItems(policyId)
// sort items so inactive is last
$: items = $selectedPolicyItems
$: approvedItems = items.filter(itemIsApproved)
$: itemsForTable = hideInactive ? approvedItems.slice(0, 15) : items.slice(0, 15)

$: recentClaims = $selectedPolicyClaims.filter(isRecent)
$: claimsForTable = showAllClaims ? $selectedPolicyClaims : recentClaims.slice(0, 15)
$: allClaimsBtnDisabled = claimsForTable.length >= $selectedPolicyClaims.length
$: openClaimCount = recentClaims.filter(claimIsOpen).length

$: policyName = getNameOfPolicy(policy)
$: policyName && (metatags.title = formatPageTitle(`Policies > ${policyName}`))
$: coverage = formatMoney(approvedItems.reduce((sum, item) => sum + item.coverage_amount, 0))
$: premium = formatMoney(approvedItems.reduce((sum, item) => sum + item.annual_premium, 0))
$: entityCode = policy.entity_code?.code
$: numberOfItemsNotShown = items.length - itemsForTable.length
$: gotoItemsBtnLabel = `View ${numberOfItemsNotShown} more items…`

// Dynamic breadcrumbs data:
$: userIsAdmin = isAdmin($roleSelection)
$: adminBreadcrumbs = [
  { name: 'Policies', url: POLICIES },
  { name: policyName, url: policyDetails(policyId) },
]

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

const onBatchDelete = () => {
  deleteItems(checkedItems, policyId)
  checkedItems = []
}

const onClone = () => {
  cloneItems(checkedItems, policyId)
  checkedItems = []
}

const handleChange = (e: CustomEvent<PolicyItem>) => {
  const item: PolicyItem = e.detail
  if (checkedItems.some((ci) => ci.id === item.id)) {
    checkedItems = checkedItems.filter((ci) => ci.id !== item.id)
  } else {
    checkedItems = [...checkedItems, item]
  }
}

const hideInactiveItems = (): void => {
  hideInactive = true
}

const showInactiveItems = (): void => {
  hideInactive = false
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
  {#if userIsAdmin}
    <Breadcrumb links={adminBreadcrumbs} />
  {/if}

  <Row cols={'12'}>
    <CardsGrid
      isAdmin={userIsAdmin}
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
    <div>
      {#if isAboveTablet()}
        <Checkbox label="Hide Inactive" on:checked={hideInactiveItems} on:unchecked={showInactiveItems} />
      {:else}
        <Switch on:selected={hideInactiveItems} on:deselected={showInactiveItems} label="Hide Inactive" />
      {/if}
    </div>
  </div>
  {#if $loading && isLoadingById(`policies/${policyId}/items`)}
    Loading items...
  {:else}
    <ItemsTable
      items={itemsForTable}
      {checkedItems}
      {policyId}
      batchActionDisabled={checkedItems.length === 0}
      on:delete={onDelete}
      on:gotoItem={(e) => $goto(e.detail)}
      on:change={handleChange}
      on:batchDelete={onBatchDelete}
      on:clone={onClone}
    />
    <div class="text-align-center">
      <p class="item-footer">Showing {itemsForTable.length} out of {items.length} items</p>
      {#if numberOfItemsNotShown > 0}
        <Button url={itemsRoute(policyId)}>{gotoItemsBtnLabel}</Button>
      {/if}
    </div>
  {/if}

  <CustomerReport {policy} />

  <Strikes {userIsAdmin} {policy} />

  <div class="p-2" />
</Page>
