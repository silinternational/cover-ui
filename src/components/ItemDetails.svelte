<script lang="ts">
import { Banner, ItemBanner, MessageBanner } from 'components'
import {
  AccountablePersonOptions,
  getAccountablePerson,
  getDependentOptions,
  getPolicyMemberOptions,
} from 'data/accountablePersons'
import { dependentsByPolicyId } from 'data/dependents'
import type { PolicyItem, ItemCoverageStatus } from 'data/items'
import { getPolicyById, loadPolicy, policies, Policy } from 'data/policies'
import { membersByPolicyId } from 'data/policy-members'
import { formatMoney } from 'helpers/money'
import { formatDate } from './dates'
import { formatDistanceToNow } from 'date-fns'
import { onMount } from 'svelte'

export let item: PolicyItem
export let isCheckingOut: boolean
export let policyId: string

let policy: Policy
let accountablePersons: AccountablePersonOptions[]

onMount(() => loadPolicy(policyId))

$: $policies && (policy = getPolicyById(policyId))
$: householdId = policy.household_id ? policy.household_id : ''

$: statusText = getItemStatusText(item)
$: status = (item.coverage_status || '') as ItemCoverageStatus
$: showRevisionMessage = item.status_reason && status === 'Revision'
$: startDate = formatDate(item.coverage_start_date)

$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)

$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)

$: accountablePersons = [...policyMemberOptions, ...dependentOptions]
$: accountablePersonName = getAccountablePerson(item, accountablePersons)?.name

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
</style>

<div class="flex p-1" class:isCheckingOut>
  <div class="w-25">
    <h2 class="break-word my-1">{item.name || ''}</h2>
    <b>Covered value</b>
    <div class="my-2px">{formatMoney(item.coverage_amount)}</div>
    <b>Annual premium</b>
    <div class="my-2px">{formatMoney(item.annual_premium)}</div>
    <br />
    <b>{accountablePersonName || ''}</b>
    <div class="mt-4px">Household ID</div>
    <div>{householdId}</div>
  </div>

  <div class="w-75">
    {#if !isCheckingOut}
      <ItemBanner itemStatus={status}>{statusText}</ItemBanner>
      {#if showRevisionMessage}
        <MessageBanner>{item.status_reason}</MessageBanner>
      {/if}
    {/if}
    <h3 class="break-word">{item.make || ''} {item.model || ''}</h3>
    {#if item.serial_number}
      <b class="mb-6px">Unique ID</b>
      <div class="break-word">{item.serial_number}</div>
      <br />
    {/if}
    <div class="break-word">Description: {item.description || ''}</div>
    <br />
    <Banner background="var(--mdc-theme-primary-header-bg)" color="var(--mdc-theme-primary)" class="max-content-width">
      {item.category?.name || ''}
    </Banner>
    <div class="my-1">
      <b>Starts</b>
      <div>{startDate}</div>
    </div>
  </div>
</div>
