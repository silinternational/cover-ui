<script lang="ts">
import Banner from './Banner.svelte'
import ItemBanner from './banners/ItemBanner.svelte'
import MessageBanner from './banners/MessageBanner.svelte'
import type { PolicyItem, ItemCoverageStatus } from 'data/items'
import { getPolicyById, loadPolicy, policies, Policy } from 'data/policies'
import { formatMoney } from 'helpers/money'
import { formatDate } from './dates'
import { formatDistanceToNow } from 'date-fns'
import { onMount } from 'svelte'

export let item: PolicyItem
export let isCheckingOut: boolean = false
export let policyId: string
export let isAdmin: boolean

let policy: Policy

onMount(() => loadPolicy(policyId))

$: $policies && (policy = getPolicyById(policyId))

$: statusText = getItemStatusText(item)
$: status = (item.coverage_status || '') as ItemCoverageStatus
$: showRevisionMessage = item.status_reason && status === 'Revision'
$: startDate = formatDate(item.coverage_start_date)
$: endDate = formatDate(item.coverage_end_date)
$: sidebarItems = {
  'Accountable Person': item?.accountable_person?.name,
  Location: item.country,
  'Household ID': policy?.household_id,
  'Covered value': formatMoney(item.coverage_amount),
  Premium: `${formatMoney(item.annual_premium)} / yr`,
}
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
</script>

<style>
.isCheckingOut {
  background-color: var(--mdc-theme-neutral-9);
  border-radius: 0 0 8px 8px;
}
.sidebar-item,
.body-item {
  margin-bottom: 1em;
}
.title {
  margin-bottom: 0.4em;
}
.value {
  font-size: x-large;
}
.coverage-dates {
  margin-top: 1em;
  display: flex;
}
.start-date div {
  margin-right: 2em;
}
.banners {
  margin-bottom: 0.5em;
}
</style>

<div class="flex p-1" class:isCheckingOut>
  <div class="w-25 sidebar">
    <h2 class="break-word my-1">{item.name || ''}</h2>

    {#each Object.entries(sidebarItems) as [title, value]}
      {#if title && value}
        <div class="sidebar-item">
          <div class="title"><b>{title}</b></div>
          <div class="value">{value}</div>
        </div>
      {/if}
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
      {#if title && value}
        <div class="body-item">
          <div class="title"><b>{title}</b></div>
          <div class="value break-word">{value}</div>
        </div>
      {/if}
    {/each}

    <Banner background="var(--mdc-theme-primary-header-bg)" color="var(--mdc-theme-primary)" class="max-content-width">
      {item.category?.name || ''}
    </Banner>

    <div class="coverage-dates">
      <div class="start-date">
        <b>Coverage starts</b>
        <div class="value">{startDate}</div>
      </div>
      <div class="end-date">
        <b>Coverage ends</b>
        <div class="value">{endDate || '—'}</div>
      </div>
    </div>
  </div>
</div>
