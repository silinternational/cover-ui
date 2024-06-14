<script lang="ts">
import { CardsGrid, RecentActivityTable, Row } from 'components'
import { loading } from 'components/progress'
import { Claim, statusesAwaitingSignator, statusesAwaitingSteward } from 'data/claims'
import { roleSelection } from 'data/role-policy-selection'
import { isRecentClaim, isRecentItem, loadRecentActivity, RecentChange, recentChanges } from 'data/recent-activity'
import { ItemCoverageStatus, PolicyItem } from 'data/types/items'
import { isUserSteward } from 'data/user'
import { formatPageTitle } from 'helpers/pageTitle'
import { customerClaimDetails, itemDetails } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onDestroy, onMount } from 'svelte'

$: recentClaimsForSignator = $recentChanges.filter(
  (change: RecentChange) => isRecentClaim(change) && claimNeedsSignator(change.Claim)
)

$: recentClaimsForSteward = $recentChanges.filter(
  (change: RecentChange) => isRecentClaim(change) && claimNeedsSteward(change.Claim)
)

$: recentItems = $recentChanges.filter((change: RecentChange) => isRecentItem(change) && itemNeedsAction(change.Item))

$: sortedFilteredChanges =
  $roleSelection && isUserSteward($roleSelection)
    ? [...recentClaimsForSteward, ...recentItems]
    : [...recentClaimsForSignator, ...recentItems]

metatags.title = formatPageTitle('Admin > Home')

let timeoutId: number | undefined

onMount(() => {
  // TODO: recent activity does not include old items (those over 1 week) that are still unresolved.
  refresh()
})

function refresh() {
  loadRecentActivity()
  timeoutId = setTimeout(refresh, 60000) as unknown as number
}

onDestroy(() => {
  clearTimeout(timeoutId)
})

const claimNeedsSignator = (claim: Claim): boolean => statusesAwaitingSignator.includes(claim.status)
const claimNeedsSteward = (claim: Claim): boolean => statusesAwaitingSteward.includes(claim.status)

const itemNeedsAction = (item: PolicyItem): boolean => item.coverage_status === ItemCoverageStatus.Pending

const onGotoClaim = (event: CustomEvent<Claim>) => $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))
const onGotoPolicyItem = (event: CustomEvent<PolicyItem>) => $goto(itemDetails(event.detail.policy_id, event.detail.id))
</script>

<Page layout="grid">
  <Row cols="12">
    <CardsGrid
      isAdmin
      recentChanges={sortedFilteredChanges}
      on:goto-claim={onGotoClaim}
      on:goto-item={onGotoPolicyItem}
    />
  </Row>

  <Row cols={'12'}>
    <h3>Recent activity</h3>
    <RecentActivityTable loading={$loading} recentChanges={$recentChanges} />
  </Row>
</Page>
