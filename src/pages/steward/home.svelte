<script lang="ts">
import { ClaimCards, Row } from 'components'
import { AccountablePersonOptions, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { Claim, claims, initialized as claimsInitialized, loadClaims, statusesAwaitingSteward } from 'data/claims'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { itemsByPolicyId, loadItems } from 'data/items'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

let claimsAwaitingSteward: Claim[]

$: $claimsInitialized || loadClaims()
$: claimsAwaitingSteward = $claims.filter(isAwaitingSteward)
$: claimsAwaitingSteward.map((claim) => claim.policy_id).forEach(loadDataOnce)

$: items = [].concat(...Object.values($itemsByPolicyId))
$: dependents = [].concat(...Object.values($dependentsByPolicyId))
$: policyMembers = [].concat(...Object.values($membersByPolicyId))

$: dependentOptions = getDependentOptions(dependents)
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions] as AccountablePersonOptions[]

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
const onGotoClaim = (event) => $goto(`/steward/claims/${event.detail}`)
</script>

<style>
</style>

<Page layout="grid">
  <Row cols="12">
    <ClaimCards {accountablePersons} claims={claimsAwaitingSteward} {items} on:goto-claim={onGotoClaim} />
  </Row>

  <Row cols={'12'}>(Recent activity)</Row>
</Page>
