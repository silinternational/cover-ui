<script lang="ts">
import type { Claim } from 'data/claims'
import { formatMoney } from 'helpers/money'
import { Datatable } from '@silintl/ui-components'

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
    <HeaderItem>Recent Activity</HeaderItem>
    <HeaderItem>From</HeaderItem>
    <HeaderItem numeric>Value</HeaderItem>
    <HeaderItem numeric>Premium</HeaderItem>
    <HeaderItem>Type</HeaderItem>
  </HeaderRow>
  <TableBody>
    {#each recentChanges as recentChange}
      <DataRow>
        {#if recentChange.Claim}
          <RowItem>{getClaimItemName(recentChange.Claim)}</RowItem>
          <RowItem>???</RowItem>
          <RowItem>{getClaimItemPersonName(recentChange.Claim, people)}</RowItem>
          <RowItem numeric>{getFormattedClaimItemValue(recentChange.Claim)}</RowItem>
          <RowItem numeric>{getFormattedClaimItemPremium(recentChange.Claim)}</RowItem>
          <RowItem>Claim</RowItem>
        {/if}
      </DataRow>
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