<script lang="ts">
import { Breadcrumb, CardsGrid, ClaimsTable, ItemsTable, Row, Strikes, CustomerReport } from 'components'
import { isLoadingById, loading } from 'components/progress'
import CopyTableButton from '../../components/Datatable/CopyTableButton.svelte'
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
import { Button, Checkbox, Datatable, isAboveMobile, isAboveTablet, Page, Switch } from '@silintl/ui-components'
import { generateRandomID } from '@silintl/ui-components/random'
import { onMount } from 'svelte'

export let policyId: string

let policy = {} as Policy
let showAllClaims = false
let hideInactive = false
const uniqueTableClass = generateRandomID('items-table-')

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
$: itemsForTable = hideInactive ? approvedItems.slice(0, 15) : $selectedPolicyItems.slice(0, 15)

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

const onBatchDelete = (e: CustomEvent<PolicyItem[]>) => {
  deleteItems(e.detail, policyId)
}

const onBatchClone = (e: CustomEvent<PolicyItem[]>) => {
  cloneItems(e.detail, policyId)
}

const hideInactiveItems = (): void => {
  hideInactive = true
}

const showInactiveItems = (): void => {
  hideInactive = false
}
</script>

<style lang="postcss">
.subtext {
  font-weight: normal;
  font-size: small;
  padding-left: 0.5rem;
}
.item-footer {
  margin: 1rem auto 0 auto;
  font-size: 11px;
}

section:not(:first-child) {
  margin-block-start: 2rem;
}

.main-header {
  container-type: inline-size;
}
.main-header-bits {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  row-gap: 1rem;
  column-gap: clamp(2rem, 5vw, 6rem);
  & * {
    justify-content: start;
  }
}
.main-header h1 {
  grid-column: 1 / -1;
}
.main-header dd {
  margin-inline-start: clamp(0.5rem, 2vw, 2rem);
}
.main-header dl {
  grid-column: span 1;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  align-content: start;
  margin: unset;
}

@container (width >= 600px) {
  .main-header .main-header-bits {
    grid-template-columns: repeat(2, max-content) 1fr;
  }
  .main-header div.menu-button-container {
    margin-inline-start: auto;
  }
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

  <!-- HEADER -->
  <header class="main-header">
    <h1>{getNameOfPolicy($selectedPolicy)} Policy</h1>
    <div class="main-header-bits">
      <dl>
        <dt>Coverage</dt>
        <dd>{coverage}</dd>
        <dt>Premium</dt>
        <dd>{premium} per year</dd>
        <dt>Last Updated</dt>
        <dd>{formatFriendlyDate(policy.updated_at)}</dd>
      </dl>
      <dl>
        <dt>Policy Type</dt>
        <dd>{policy.type}</dd>
        {#if policy.type === PolicyType.Team}
          <dt>Name</dt>
          <dd>{getNameOfPolicy(policy)}</dd>
          <dt>Account</dt>
          <dd>{policy.account || '-'}</dd>
          <dt>Account Detail</dt>
          <dd>{policy.account_detail || '-'}</dd>
          <dt>Cost Center</dt>
          <dd>{policy.cost_center || '-'}</dd>
          <dt>Entity Code</dt>
          <dd>{entityCode || '-'}</dd>
        {:else if policy.type === PolicyType.Household}
          <dt>Household ID</dt>
          <dd>{policy.household_id || '-'}</dd>
        {/if}
      </dl>
    </div>
  </header>

  <!-- MEMBERS -->
  <section>
    <header class="flex justify-between align-items-center">
      <h2>Members</h2>
      <Button url={settingsPolicy(policyId)}>Policy Settings</Button>
    </header>
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
  </section>

  <!-- RECENT CLAIMS -->
  <section>
    <header class="flex justify-between align-items-center">
      <h2>Recent Claims <span class="subtext">{openClaimCount} open</span></h2>
      <div class="button-group">
        <Button disabled={allClaimsBtnDisabled} on:click={() => (showAllClaims = true)}>All Claims…</Button>
      </div>
    </header>
    {#if $loading && isLoadingById(`policies/${policyId}/claims`)}
      Loading claims...
    {:else}
      <ClaimsTable claims={claimsForTable} {policyId} />
    {/if}
  </section>

  <!-- ITEMS -->
  <section>
    <header class="flex justify-between align-items-center">
      <h2>Items <span class="subtext">{approvedItems?.length} covered</span></h2>
      <div class="button-group tw-flex tw-gap-fl-xs">
        {#if isAboveTablet()}
          <Checkbox label="Hide Inactive" on:checked={hideInactiveItems} on:unchecked={showInactiveItems} />
        {:else}
          <Switch on:selected={hideInactiveItems} on:deselected={showInactiveItems} label="Hide Inactive" />
        {/if}
        <CopyTableButton {uniqueTableClass} />
      </div>
    </header>
    {#if $loading && isLoadingById(`policies/${policyId}/items`)}
      Loading items...
    {:else}
      <ItemsTable
        items={itemsForTable}
        {policyId}
        on:delete={onDelete}
        on:gotoItem={(e) => $goto(e.detail)}
        on:batchDelete={onBatchDelete}
        on:batchClone={onBatchClone}
        includeCopyToClipboard={false}
        {uniqueTableClass}
      />
      <div class="text-align-center">
        <p class="item-footer">Showing {itemsForTable.length} out of {items.length} items</p>
        {#if numberOfItemsNotShown > 0}
          <Button url={itemsRoute(policyId)}>{gotoItemsBtnLabel}</Button>
        {/if}
      </div>
    {/if}
  </section>

  <section>
    <h2>Reports</h2>
    <CustomerReport {policy} />
  </section>

  <section>
    <Strikes {userIsAdmin} {policy} />
  </section>

  <div class="p-2" />
</Page>
