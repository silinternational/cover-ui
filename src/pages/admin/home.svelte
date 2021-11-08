<script lang="ts">
import type { UserAppRole } from '../../authn/user'
import { CardsGrid, ClaimCards, RecentActivityTable, Row } from 'components'
import { loading } from 'components/progress'
import { getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { Claim, getClaimsAwaitingAdmin } from 'data/claims'
import { allPolicyDependents, dependentsByPolicyId, loadDependents } from 'data/dependents'
import { allPolicyItems, itemsByPolicyId, loadItems, PolicyItem } from 'data/items'
import { allPolicyMembers, loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { loadRecentActivity, recentChanges } from 'data/recent-activity'
import { roleSelection } from 'data/role-policy-selection'
import { customerClaimDetails, itemDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

let actionableClaims: Claim[] = []

loadRecentActivity()

// $: loadClaimsAwaitingAdmin($roleSelection)
$: actionableClaims.map((claim) => claim.policy_id).forEach(loadDataOnce)

$: policyItems = $allPolicyItems
$: dependents = $allPolicyDependents
$: policyMembers = $allPolicyMembers

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
