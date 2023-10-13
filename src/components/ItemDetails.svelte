<script lang="ts">
import ItemBanner from './banners/ItemBanner.svelte'
import MessageBanner from './banners/MessageBanner.svelte'
import { ItemCoverageStatus, PolicyItem } from 'data/items'
import { getPolicyById, loadPolicy, policies, Policy, PolicyType } from 'data/policies'
import { getPremiumDescription, getRenewalDate, getStartDate } from 'helpers/coverage'
import { formatDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import InfoBoxModal from './InfoBoxModal.svelte'
import { formatDistanceToNow } from 'date-fns'
import { IconButton, StaticChip } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let item: PolicyItem
export let isCheckingOut: boolean = false
export let policyId: string
export let isAdmin: boolean = false

let policy: Policy

const showInfoBox: boolean[] = []
const assignedTo = 'Accountable Person'

onMount(() => loadPolicy(policyId))

$: $policies && (policy = getPolicyById(policyId))

$: statusText = getItemStatusText(item)
$: status = (item.coverage_status || '') as ItemCoverageStatus
$: showRevisionMessage = item.status_reason && status === ItemCoverageStatus.Revision
$: startDate = getStartDate(item)
$: endDate = formatDate(item.coverage_end_date)
$: renewDate = getRenewalDate(item)
$: commonDetails = {
  [assignedTo]: item?.accountable_person?.name,
  Location: item.accountable_person?.country || item.country,
}
$: householdId = {
  'Household ID': policy?.household_id,
}
$: teamDetails = {
  'Policy Name': policy?.name,
  Affiliation: policy.entity_code?.name,
  'Cost Center': policy.cost_center,
  'Internal Account': policy.account,
}
$: minimumDeductible = item?.category?.minimum_deductible
$: minimumDeductibleDescription = (minimumDeductible > 1) ? `(subject to ${formatMoney(minimumDeductible)} minimum)` : ''
$: moneyDetails = {
  Value: formatMoney(item.coverage_amount),
  Premium: getPremiumDescription(item),
  Deductible: `5% ${minimumDeductibleDescription}`.trim(),
}
$: sidebarDetailsArray =
  policy.type === PolicyType.Team
    ? [moneyDetails, { ...commonDetails, ...teamDetails }]
    : [moneyDetails, { ...commonDetails, ...householdId }]

const getItemStatusText = (item: PolicyItem) => {
  const updatedAtStr = item.updated_at ? formatDistanceToNow(Date.parse(item.updated_at), { addSuffix: true }) : ''
  const statusChangeStr = item.status_change ? `${item.status_change} ` : updatedAtStr ? 'Submitted ' : ''

  return statusChangeStr + updatedAtStr
}

const toggleModal = (i: number) => (showInfoBox[i] = !showInfoBox[i])
</script>

<style lang="postcss">
dl {
  margin-bottom: 1.5rem;
}
dt {
  color: var(--mdc-theme-text-secondary-on-light);
  margin-top: 0.5rem;
}
dd {
  margin-left: unset;
}
.horizontal-dl {
  display: grid;
  grid-template-rows: auto auto;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  gap: 0.5rem;
  width: max-content;
}
.payment-header {
  background-color: var(--mdc-theme-neutral-bg);
  padding: 4px;
  border-radius: 8px 8px 0 0;
}
.wrapper {
  background-color: var(--mdc-theme-neutral-9);
  border-radius: 0 0 8px 8px;
}
section {
  flex-direction: column;
  flex-grow: 1;
  flex-basis: max-content;
}
.banners {
  margin-bottom: 0.5em;
}
</style>

{#if !isCheckingOut}
  <div class="banners">
    <ItemBanner itemStatus={status} {isAdmin}>{statusText}</ItemBanner>
    {#if showRevisionMessage}
      <MessageBanner class="mt-4px">{item.status_reason}</MessageBanner>
    {/if}
  </div>
{/if}

<div class="payment-header flex justify-between align-items-center px-1">
  <span class="align-items-center tw-flex tw-gap-fl-xs">
    <h2>{item.name}</h2>
  </span>
  <slot name="headerButtonGroup" />
</div>

<div class="flex-wrap p-1 tw-fl-gap-xs wrapper tw-flex">
  <section>
    <h3>Item</h3>
    <dl>
      <dt>Category</dt>
      <dd>
        <StaticChip class="max-content-width">
          {item.category?.name || '–'}
        </StaticChip>
      </dd>
      <div class="horizontal-dl">
        <dt>Brand</dt>
        <dd>{item?.make || '–'}</dd>
        <dt>Model</dt>
        <dd>{item?.model || '–'}</dd>
        {#if item?.year}
          <dt>Year</dt>
          <dd>{item?.year}</dd>
        {/if}
      </div>
      <dt>Unique ID</dt>
      <dd>{item?.serial_number || '–'}</dd>
      <dt>Notes</dt>
      <dd class="tw-max-w-prose">{item?.description || '–'}</dd>
    </dl>
  </section>
  <section>
    <h3>Coverage</h3>
    {#each sidebarDetailsArray as sidebarDetail}
      <dl>
        {#each Object.entries(sidebarDetail) as [title, value], i}
          <div class="sidebar-item">
            {#if ['Location'].includes(title) && !value}
              <dt>
                <div class="flex align-items-center relative">
                  {title}
                  <span class="relative">
                    <IconButton class="gray absolute" icon="info" on:click={() => toggleModal(i)} />
                  </span>
                </div>
              </dt>
              <InfoBoxModal
                {i}
                {policyId}
                itemId={item.id}
                {sidebarDetailsArray}
                open={showInfoBox[i]}
                on:closed={() => (showInfoBox[i] = false)}
              />
            {:else}
              <dt>{title}</dt>
            {/if}
            <dd>{value || '-'}</dd>
          </div>
        {/each}
      </dl>
    {/each}
    <dt>Starts</dt>
    <dd class="value">{startDate || '—'}</dd>
    <dt>{endDate ? 'Ends' : 'Renews'}</dt>
    <dd class="value">{endDate || renewDate || '—'}</dd>
  </section>
</div>
