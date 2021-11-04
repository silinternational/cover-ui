<script lang="ts">
import { UserAppRole } from '../../authn/user'
import { ClaimCards, RecentActivityTable, Row } from 'components'
import { loading } from 'components/progress'
import { getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { Claim, getClaimsAwaitingAdmin } from 'data/claims'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { allPolicyItems, itemsByPolicyId, loadItems } from 'data/items'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { loadRecentActivity, recentChanges } from 'data/recent-activity'
import { roleSelection } from 'data/role-policy-selection'
import { customerClaimDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

let actionableClaims: Claim[] = []

loadRecentActivity()

$: loadClaimsAwaitingAdmin($roleSelection)
$: actionableClaims.map((claim) => claim.policy_id).forEach(loadDataOnce)

$: items = $allPolicyItems
$: dependents = [].concat(...Object.values($dependentsByPolicyId))
$: policyMembers = [].concat(...Object.values($membersByPolicyId))

$: dependentOptions = getDependentOptions(dependents)
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions]

const loadClaimsAwaitingAdmin = async (role: UserAppRole) => {
  actionableClaims = await getClaimsAwaitingAdmin(role)
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
    <ClaimCards isAdmin {accountablePersons} claims={actionableClaims} {items} on:goto-claim={onGotoClaim} />
  </Row>

  <Row cols={'12'}>
    <h3>Recent activity</h3>
    <RecentActivityTable {dependents} loading={$loading} {policyMembers} recentChanges={$recentChanges} />
  </Row>
</Page>
