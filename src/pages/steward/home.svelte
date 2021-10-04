<script lang="ts">
import { ClaimCards, Row } from '../../components/'
import { Claim, claims, initialized as claimsInitialized, loadClaims, statusesAwaitingSteward } from '../../data/claims'
import { itemsByPolicyId, loadItems } from '../../data/items'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

let claimsAwaitingSteward: Claim[]

$: $claimsInitialized || loadClaims()
$: claimsAwaitingSteward = $claims.filter(isAwaitingSteward)

$: claimsAwaitingSteward.map((claim) => claim.policy_id).forEach(loadOnce)

$: items = [].concat(...Object.values($itemsByPolicyId))

const isAwaitingSteward = (claim: Claim): boolean => {
  return statusesAwaitingSteward.includes(claim.status)
}
const loadOnce = (policyId: string) => {
  if (!Array.isArray($itemsByPolicyId[policyId])) {
    loadItems(policyId)
  }
}
const onGotoClaim = (event) => $goto(`/steward/claims/${event.detail}`)
</script>

<style>
</style>

<Page layout="grid">
  <Row cols={'12'}>
    <ClaimCards claims={claimsAwaitingSteward} {items} on:goto-claim={onGotoClaim} />
  </Row>

  <Row cols={'12'}>(Recent activity)</Row>
</Page>
