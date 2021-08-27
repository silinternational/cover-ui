<script>
import user from '../authn/user'
import { ClaimCards, Row } from '../components/'
import { claims, initialized as claimsInitialized, loadClaims } from '../data/claims'
import { itemsByPolicyId, loadItems } from '../data/items'
import { goto } from '@roxi/routify'
import { Page, Button } from '@silintl/ui-components'

$: $claimsInitialized || loadClaims()

$: policyId = $user.policy_id
$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []

const onEditClaim = event => {
  const claimId = event.detail
  $goto(`/claims/${claimId}/edit`)
}
const onGotoClaim = event => {
  const claimId = event.detail
  $goto(`/claims/${claimId}`)
}
</script>

<Page layout="grid">
  <Row cols={'12'}>
    <Button raised url="/claims/newClaim">New claim</Button>
  </Row>

  <Row cols={'12'}>
    {#if $claims.length}
      <ClaimCards claims={$claims} {items} on:edit-claim={onEditClaim} on:goto-claim={onGotoClaim} />
    {:else}
      No claims at this time.
    {/if}
  </Row>
</Page>
