<script lang="ts">
import { CardsGrid, RecentActivityTable, Row } from 'components'
import { loading } from 'components/progress'
import type { Claim } from 'data/claims'
import type { PolicyItem } from 'data/items'
import { loadRecentActivity, recentChanges } from 'data/recent-activity'
import { customerClaimDetails, itemDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

onMount(() => {
  // TODO: recent activity does not include old items (those over 1 week) that are still unresolved.
  loadRecentActivity()
})

const onGotoClaim = (event: CustomEvent<Claim>) => $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))
const onGotoPolicyItem = (event: CustomEvent<PolicyItem>) => $goto(itemDetails(event.detail.policy_id, event.detail.id))
</script>

<style>
</style>

<Page layout="grid">
  <Row cols="12">
    <CardsGrid isAdmin recentChanges={$recentChanges} on:goto-claim={onGotoClaim} on:goto-item={onGotoPolicyItem} />
  </Row>

  <Row cols={'12'}>
    <h3>Recent activity</h3>
    <RecentActivityTable loading={$loading} recentChanges={$recentChanges} />
  </Row>
</Page>
