<script lang="ts">
import type { Claim } from 'data/claims'
import type { PolicyItem } from 'data/items'
import { isRecentClaim, isRecentItem, RecentChange } from 'data/recent-activity'
import { isMonthly } from 'helpers/coverage'
import { formatMoney } from 'helpers/money'
import { customerClaimDetails, itemDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { Datatable } from '@silintl/ui-components'

export let loading = false
export let recentChanges: RecentChange[] = []

const HeaderRow = Datatable.Header
const HeaderItem = Datatable.Header.Item
const TableBody = Datatable.Data
const DataRow = Datatable.Data.Row
const RowItem = Datatable.Data.Row.Item

const getClaimItemName = (claim: Claim): string => {
  const claimItem = claim.claim_items[0]
  return claimItem?.item?.name || ''
}

const getClaimItemPersonName = (claim: Claim): string => {
  const claimItem = claim.claim_items[0]
  return getItemPersonName(claimItem?.item)
}

const getItemPersonName = (item: PolicyItem): string => {
  return item?.accountable_person?.name || ''
}

const getFormattedClaimItemValue = (claim: Claim): string => {
  const claimItem = claim.claim_items[0]
  return formatMoney(claimItem?.item?.coverage_amount)
}

const getFormattedClaimItemPremium = (claim: Claim): string => {
  const claimItem = claim.claim_items[0]
  return formatMoney(claimItem?.item?.annual_premium)
}

const getMonthlyPremiumFromClaim = (claim: Claim): string => {
  const claimItem = claim.claim_items[0]
  return formatMoney(claimItem?.item?.monthly_premium)
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
      {#if isRecentClaim(recentChange)}
        <DataRow clickable on:click={$goto(customerClaimDetails(recentChange.Claim.policy_id, recentChange.Claim.id))}>
          <RowItem>{getClaimItemName(recentChange.Claim)}</RowItem>
          <RowItem>{recentChange.Claim.status_change}</RowItem>
          <RowItem>{getClaimItemPersonName(recentChange.Claim)}</RowItem>
          <RowItem numeric>{getFormattedClaimItemValue(recentChange.Claim)}</RowItem>
          <RowItem numeric>
            {getFormattedClaimItemPremium(recentChange.Claim)}
            {#if isMonthly(recentChange.Claim.claim_items[0]?.item)}
              <div>
                <small class="tw-opacity-60">({getMonthlyPremiumFromClaim(recentChange.Claim)}/month)</small>
              </div>
            {/if}
          </RowItem>
          <RowItem>Claim</RowItem>
        </DataRow>
      {:else if isRecentItem(recentChange)}
        <DataRow clickable on:click={$goto(itemDetails(recentChange.Item.policy_id, recentChange.Item.id))}>
          <RowItem>{recentChange.Item.name}</RowItem>
          <RowItem>{recentChange.Item.status_change}</RowItem>
          <RowItem>{getItemPersonName(recentChange.Item)}</RowItem>
          <RowItem numeric>{formatMoney(recentChange.Item.coverage_amount)}</RowItem>
          <RowItem numeric>
            {formatMoney(recentChange.Item.annual_premium)}
            {#if isMonthly(recentChange.Item)}
              <div>
                <small class="tw-opacity-60">({formatMoney(recentChange.Item.monthly_premium)}/month)</small>
              </div>
            {/if}
          </RowItem>
          <RowItem>Coverage</RowItem>
        </DataRow>
      {/if}
    {:else}
      <DataRow>
        <RowItem colspan={7}>
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
