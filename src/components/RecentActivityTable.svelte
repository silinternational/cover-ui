<script lang="ts">
import type { Claim } from 'data/claims'
import { formatMoney } from 'helpers/money'
import { Datatable } from '@silintl/ui-components'
import type { PolicyItem } from '../data/items'
import { goto } from '@roxi/routify'
import { customerClaimDetails, itemDetails } from 'helpers/routes'

export let dependents = []
export let loading = false
export let policyMembers = []
export let recentChanges = []

const HeaderRow = Datatable.Header
const HeaderItem = Datatable.Header.Item
const TableBody = Datatable.Data
const DataRow = Datatable.Data.Row
const RowItem = Datatable.Data.Row.Item

$: people = { policyMembers, dependents }

const getClaimItemName = (claim: Claim): string => {
  const claimItem = claim.claim_items[0]
  return claimItem?.item?.name || ''
}

const getClaimItemPersonName = (claim: Claim, people): string => {
  const claimItem = claim.claim_items[0]
  return getItemPersonName(claimItem?.item, people)
}

const getItemPersonName = (item: PolicyItem | undefined, people): string => {
  const accountableUserId = item?.accountable_user_id
  if (accountableUserId) {
    const accountableUser = people.policyMembers.find((policyMember) => policyMember.id === accountableUserId)
    const userDisplayName = accountableUser?.first_name + ' ' + accountableUser?.last_name
    return accountableUser ? userDisplayName : ''
  }

  const accountableDependentId = item?.accountable_dependent_id
  const accountableDependent = people.dependents.find((dependent) => dependent.id === accountableDependentId)
  return accountableDependent?.name || ''
}

const getFormattedClaimItemValue = (claim: Claim): string => {
  const claimItem = claim.claim_items[0]
  return formatMoney(claimItem?.item?.coverage_amount)
}

const getFormattedClaimItemPremium = (claim: Claim): string => {
  const claimItem = claim.claim_items[0]
  return formatMoney(claimItem?.item?.annual_premium)
}
</script>

<Datatable>
  <HeaderRow>
    <HeaderItem>Item</HeaderItem>
    <HeaderItem>Recent Change</HeaderItem>
    <HeaderItem>From</HeaderItem>
    <HeaderItem numeric>Value</HeaderItem>
    <HeaderItem numeric>Premium</HeaderItem>
    <HeaderItem>Type</HeaderItem>
  </HeaderRow>
  <TableBody>
    {#each recentChanges as recentChange}
      {#if recentChange.Claim}
        <DataRow clickable on:click={$goto(customerClaimDetails(recentChange.Claim.policy_id, recentChange.Claim.id))}>
          <RowItem>{getClaimItemName(recentChange.Claim)}</RowItem>
          <RowItem>{recentChange.Claim.status_change}</RowItem>
          <RowItem>{getClaimItemPersonName(recentChange.Claim, people)}</RowItem>
          <RowItem numeric>{getFormattedClaimItemValue(recentChange.Claim)}</RowItem>
          <RowItem numeric>{getFormattedClaimItemPremium(recentChange.Claim)}</RowItem>
          <RowItem>Claim</RowItem>
        </DataRow>
      {:else if recentChange.Item}
        <DataRow clickable on:click={$goto(itemDetails(recentChange.Item.policy_id, recentChange.Item.id))}>
          <RowItem>{recentChange.Item.name}</RowItem>
          <RowItem>{recentChange.Item.status_change}</RowItem>
          <RowItem>{getItemPersonName(recentChange.Item, people)}</RowItem>
          <RowItem numeric>{formatMoney(recentChange.Item.coverage_amount)}</RowItem>
          <RowItem numeric>{formatMoney(recentChange.Item.annual_premium)}</RowItem>
          <RowItem>Coverage</RowItem>
        </DataRow>
      {/if}
    {:else}
      <DataRow>
        <RowItem colspan="7">
          {#if loading}
            Loading...
          {:else}
            No recent activity
          {/if}
        </RowItem>
      </DataRow>
    {/each}
  </TableBody>
</Datatable>
