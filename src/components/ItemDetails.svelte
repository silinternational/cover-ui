<script lang="ts">
import Banner from './Banner.svelte'
import ItemBanner from './banners/ItemBanner.svelte'
import MessageBanner from './banners/MessageBanner.svelte'
import { PolicyItem, ItemCoverageStatus } from 'data/items'
import { getPolicyById, loadPolicy, policies, Policy, PolicyType } from 'data/policies'
import user from 'data/user'
import { formatMoney } from 'helpers/money'
import { Dialog, IconButton } from '@silintl/ui-components'
import { formatDate } from '../helpers/dates'
import { formatDistanceToNow } from 'date-fns'
import { onMount } from 'svelte'
import { itemEdit, settingsPolicy, SETTINGS_PERSONAL } from 'helpers/routes'

export let item: PolicyItem
export let isCheckingOut: boolean = false
export let policyId: string
export let isAdmin: boolean

let policy: Policy

const showInfoBox: boolean[] = []
const assignedTo = 'Assigned To'

onMount(() => loadPolicy(policyId))

$: $policies && (policy = getPolicyById(policyId))

$: statusText = getItemStatusText(item)
$: status = (item.coverage_status || '') as ItemCoverageStatus
$: showRevisionMessage = item.status_reason && status === ItemCoverageStatus.Revision
$: startDate = formatDate(item.coverage_start_date)
$: endDate = formatDate(item.coverage_end_date)
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
$: moneyDetails = {
  'Covered value': formatMoney(item.coverage_amount),
  Premium: `${formatMoney(item.annual_premium)} / yr`,
}
$: sidebarDetailsArray =
  policy.type === PolicyType.Team
    ? [commonDetails, teamDetails, moneyDetails]
    : [commonDetails, householdId, moneyDetails]
$: bodyItems = {
  Model: `${item?.make} ${item?.model}`,
  'Unique ID': item?.serial_number,
  Description: item?.description,
}

const getItemStatusText = (item: PolicyItem) => {
  const updatedAtStr = item.updated_at ? formatDistanceToNow(Date.parse(item.updated_at), { addSuffix: true }) : ''
  const statusChangeStr = item.status_change ? `${item.status_change} ` : updatedAtStr ? 'Submitted ' : ''

  return statusChangeStr + updatedAtStr
}

const toggleModal = (i: number) => (showInfoBox[i] = !showInfoBox[i])
const getAssingee = (i: number, array: any[]) => array[i - 1][assignedTo]
</script>

<style>
.isCheckingOut {
  background-color: var(--mdc-theme-neutral-9);
  border-radius: 0 0 8px 8px;
}
.sidebar-chunk,
.body-item {
  margin-bottom: 1.25em;
}
.sidebar-item {
  margin-bottom: 0.5em;
}
.title {
  margin-bottom: 0.4em;
}
.value {
  font-size: larger;
}
.coverage-dates {
  margin-top: 1em;
  display: flex;
}
.start-date {
  margin-right: 2em;
}
.banners {
  margin-bottom: 0.5em;
}
</style>

<div class="flex p-1" class:isCheckingOut>
  <div class="w-25 sidebar">
    <h2 class="break-word my-1">{item.name || ''}</h2>

    {#each sidebarDetailsArray as sidebarDetail}
      <div class="sidebar-chunk">
        {#each Object.entries(sidebarDetail) as [title, value], i}
          <div class="sidebar-item">
            {#if ['Location'].includes(title) && !value}
              <div class="title">
                <div class="flex align-items-center">
                  <b>{title}</b>
                  <IconButton class="gray" icon="info" on:click={() => toggleModal(i)} />
                </div>
              </div>
              <Dialog.Alert
                open={showInfoBox[i]}
                buttons={[]}
                defaultAction="cancel"
                title="Why is this location empty?"
                titleIcon="info"
                on:closed={() => (showInfoBox[i] = false)}
              >
                {#if getAssingee(i, sidebarDetailsArray)}
                  <p>
                    Locations are associated with people, not items. {getAssingee(i, sidebarDetailsArray) ||
                      'The assigned person'} doesn’t have a location, so neither does the item.
                    <a
                      href={getAssingee(i, sidebarDetailsArray) === $user.name
                        ? SETTINGS_PERSONAL
                        : settingsPolicy(policyId)}>Set a location→</a
                    >
                  </p>
                {:else}
                  <p>
                    Locations are associated with people, not items. This item doesn’t have a person, so it doesn’t have
                    a location. <a href={itemEdit(policyId, item.id)}> Assign a person→ </a>
                  </p>
                {/if}
              </Dialog.Alert>
            {:else}
              <div class="title"><b>{title}</b></div>
            {/if}
            <div class="value">{value || '-'}</div>
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <div class="w-75">
    {#if !isCheckingOut}
      <div class="banners">
        <ItemBanner itemStatus={status} {isAdmin}>{statusText}</ItemBanner>
        {#if showRevisionMessage}
          <MessageBanner class="mt-4px">{item.status_reason}</MessageBanner>
        {/if}
      </div>
    {/if}

    {#each Object.entries(bodyItems) as [title, value]}
      {#if title && value && value !== ' '}
        <div class="body-item">
          <div class="title"><b>{title}</b></div>
          <div class="value break-word">{value || '-'}</div>
        </div>
      {/if}
    {/each}

    <Banner background="var(--mdc-theme-primary-header-bg)" color="var(--mdc-theme-primary)" class="max-content-width">
      {item.category?.name || ''}
    </Banner>

    <div class="coverage-dates">
      <div class="start-date">
        <b>Coverage starts</b>
        <div class="value">{startDate || '—'}</div>
      </div>
      <div class="end-date">
        <b>Coverage ends</b>
        <div class="value">{endDate || '—'}</div>
      </div>
    </div>
  </div>
</div>
