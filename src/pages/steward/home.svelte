<script lang="ts">
import { ClaimCards, RecentActivityTable, Row } from 'components'
import { loading } from 'components/progress'
import { getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { Claim, claims, initialized as claimsInitialized, loadClaims, statusesAwaitingSteward } from 'data/claims'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { allPolicyItems, itemsByPolicyId, loadItems } from 'data/items'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { loadRecentActivity, recentChanges } from 'data/recent-activity'
import { customerClaimDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

let claimsAwaitingSteward: Claim[]

loadRecentActivity()

$: $claimsInitialized || loadClaims()
$: claimsAwaitingSteward = $claims.filter(isAwaitingSteward)
$: claimsAwaitingSteward.map((claim) => claim.policy_id).forEach(loadDataOnce)

$: items = $allPolicyItems
$: dependents = [].concat(...Object.values($dependentsByPolicyId))
$: policyMembers = [].concat(...Object.values($membersByPolicyId))

$: dependentOptions = getDependentOptions(dependents)
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions]

const isAwaitingSteward = (claim: Claim): boolean => {
  return statusesAwaitingSteward.includes(claim.status)
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
const onGotoClaim = (event: CustomEvent<Claim>) => $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))
</script>

<style>
</style>

<Page layout="grid">
  <Row cols="12">
    <ClaimCards {accountablePersons} claims={claimsAwaitingSteward} {items} on:goto-claim={onGotoClaim} />
  </Row>

  <Row cols={'12'}>
    <h3>Recent activity</h3>
    <RecentActivityTable {dependents} loading={$loading} {policyMembers} recentChanges={$recentChanges} />
  </Row>
</Page>
