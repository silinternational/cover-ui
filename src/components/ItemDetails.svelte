<script lang="ts">
import Banner from './Banner.svelte'
import ItemBanner from './banners/ItemBanner.svelte'
import {
  AccountablePersonOptions,
  getAccountablePerson,
  getDependentOptions,
  getPolicyMemberOptions,
} from 'data/accountablePersons'
import { dependentsByPolicyId } from 'data/dependents'
import type { PolicyItem, ItemCoverageStatus } from 'data/items'
import { membersByPolicyId } from 'data/policy-members'
import { formatDistanceToNow } from 'date-fns'
import { formatDate } from './dates'
import { formatMoney } from 'helpers/money'

export let item: PolicyItem
export let isCheckingOut: boolean
export let policyId: string
export let householdId: string

let accountablePersons: AccountablePersonOptions[]

$: submittedText = item.updated_at ? formatDistanceToNow(Date.parse(item.updated_at), { addSuffix: true }) : ''
$: status = (item.coverage_status || '') as ItemCoverageStatus
$: startDate = formatDate(item.coverage_start_date)

$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)

$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)

$: accountablePersons = [...policyMemberOptions, ...dependentOptions]
$: accountablePersonName = getAccountablePerson(item, accountablePersons)?.name
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
    {#if isCheckingOut}
      <ItemBanner itemStatus={status}>Submitted {submittedText}</ItemBanner>
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
