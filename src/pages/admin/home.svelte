<script lang="ts">
import { CardsGrid, RecentActivityTable, Row } from 'components'
import { loading } from 'components/progress'
import { getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import type { Claim } from 'data/claims'
import { allPolicyDependents, dependentsByPolicyId, loadDependents } from 'data/dependents'
import type { PolicyItem } from 'data/items'
import { allPolicyMembers, loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { isRecentClaim, loadRecentActivity, RecentChange, recentChanges } from 'data/recent-activity'
import { customerClaimDetails, itemDetails } from 'helpers/routes'
import { uniq } from 'lodash-es'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

onMount(() => {
  // TODO: recent activity does not include old items (those over 1 week) that are still unresolved.
  loadRecentActivity()
})

$: loadRecentActivityAdditionalData($recentChanges)

$: dependents = $allPolicyDependents
$: policyMembers = $allPolicyMembers

$: dependentOptions = getDependentOptions(dependents)
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions]

const loadRecentActivityAdditionalData = (recentChanges: RecentChange[]) => {
  uniq(recentChanges.map((c) => (isRecentClaim(c) ? c.Claim : c.Item)?.policy_id)).forEach((policyId) => {
    if (!Array.isArray($dependentsByPolicyId[policyId])) {
      loadDependents(policyId)
    }
    if (!Array.isArray($membersByPolicyId[policyId])) {
      loadMembersOfPolicy(policyId)
    }
  })
}
const onGotoClaim = (event: CustomEvent<Claim>) => $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))
const onGotoPolicyItem = (event: CustomEvent<PolicyItem>) => $goto(itemDetails(event.detail.policy_id, event.detail.id))
</script>

<style>
</style>

<Page layout="grid">
  <Row cols="12">
    <CardsGrid
      isAdmin
      {accountablePersons}
      recentChanges={$recentChanges}
      on:goto-claim={onGotoClaim}
      on:goto-item={onGotoPolicyItem}
    />
  </Row>

  <Row cols={'12'}>
    <h3>Recent activity</h3>
    <RecentActivityTable {dependents} loading={$loading} {policyMembers} recentChanges={$recentChanges} />
  </Row>
</Page>
