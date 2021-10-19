<script lang="ts">
import { ClaimCards, RecentActivityTable, Row } from 'components'
import { loading } from 'components/progress'
import { AccountablePersonOptions, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { Claim, claims, initialized as claimsInitialized, loadClaims, statusesAwaitingSignator } from 'data/claims'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { itemsByPolicyId, loadItems } from 'data/items'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { loadRecentActivity, recentChanges } from 'data/recent-activity'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

let claimsAwaitingSignator: Claim[]

loadRecentActivity()

$: $claimsInitialized || loadClaims()
$: claimsAwaitingSignator = $claims.filter(isAwaitingSignator)
$: claimsAwaitingSignator.map((claim) => claim.policy_id).forEach(loadDataOnce)

$: items = [].concat(...Object.values($itemsByPolicyId))
$: dependents = [].concat(...Object.values($dependentsByPolicyId))
$: policyMembers = [].concat(...Object.values($membersByPolicyId))

$: dependentOptions = getDependentOptions(dependents)
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions] as AccountablePersonOptions[]

const isAwaitingSignator = (claim: Claim): boolean => {
  return statusesAwaitingSignator.includes(claim.status)
}
const loadDataOnce = (policyId: string) => {
  if (!Array.isArray($itemsByPolicyId[policyId])) {
    loadItems(policyId)
  }
  if (!Array.isArray($dependentsByPolicyId[policyId])) {
    loadDependents(policyId)
  }
  if (!Array.isArray($membersByPolicyId[policyId])) {
    loadMembersOfPolicy(policyId)
  }
}
const onGotoClaim = (event) => $goto(`/signator/claims/${event.detail}`)
</script>

<style>
</style>

<Page layout="grid">
  <Row cols="12">
    <ClaimCards {accountablePersons} claims={claimsAwaitingSignator} {items} on:goto-claim={onGotoClaim} />
  </Row>

  <Row cols={'12'}>
    <RecentActivityTable {dependents} loading={$loading} {policyMembers} recentChanges={$recentChanges} />
  </Row>
</Page>
