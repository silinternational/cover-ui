<script lang="ts">
import { ClaimCards, Row } from '../../components/'
import { Claim, claims, initialized as claimsInitialized, loadClaims, statusesAwaitingSteward } from '../../data/claims'
import { itemsByPolicyId, loadItems } from '../../data/items'
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
</script>

<style>
</style>

<Page layout="grid">
  <Row cols={'12'}>
    <ClaimCards claims={claimsAwaitingSteward} {items} />
  </Row>

  <Row cols={'12'}>(Recent activity)</Row>
</Page>
