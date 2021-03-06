<script lang="ts">
import { CardsGrid, RecentActivityTable, Row } from 'components'
import { loading } from 'components/progress'
import { Claim, isClaim, statusesAwaitingSignator, statusesAwaitingSteward } from 'data/claims'
import { ItemCoverageStatus, PolicyItem } from 'data/items'
import { roleSelection } from 'data/role-policy-selection'
import { isRecentClaim, loadRecentActivity, RecentChange, recentChanges } from 'data/recent-activity'
import { isUserSteward } from 'data/user'
import { customerClaimDetails, itemDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

$: filteredChanges = $roleSelection && $recentChanges.filter(recentChangesFilter)

onMount(() => {
  // TODO: recent activity does not include old items (those over 1 week) that are still unresolved.
  loadRecentActivity()
})

const recentChangesFilter = (change: RecentChange): boolean => {
  const claimOrItem: Claim | PolicyItem = isRecentClaim(change) ? change.Claim : change.Item
  return isClaim(claimOrItem) ? claimNeedsAction(claimOrItem) : itemNeedsAction(claimOrItem)
}

const itemNeedsAction = (item: PolicyItem): boolean => item.coverage_status === ItemCoverageStatus.Pending
const claimNeedsAction = (claim: Claim): boolean => isUserSteward($roleSelection) ?
    statusesAwaitingSteward.includes(claim.status) : statusesAwaitingSignator.includes(claim.status)

const onGotoClaim = (event: CustomEvent<Claim>) => $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))
const onGotoPolicyItem = (event: CustomEvent<PolicyItem>) => $goto(itemDetails(event.detail.policy_id, event.detail.id))
</script>

<Page layout="grid">
  <Row cols="12">
    <CardsGrid isAdmin recentChanges={filteredChanges} on:goto-claim={onGotoClaim} on:goto-item={onGotoPolicyItem} />
  </Row>

  <Row cols={'12'}>
    <h3>Recent activity</h3>
    <RecentActivityTable loading={$loading} recentChanges={$recentChanges} />
  </Row>
</Page>
