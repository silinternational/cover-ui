<script>
import { claims, initialized, loadClaims } from '../data/claims.js'
import { ClaimCards, Row } from '../components/'
import { Page, Button } from '@silintl/ui-components'
import { goto } from '@roxi/routify'

$: $initialized || loadClaims()

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
      <ClaimCards claims={$claims} on:edit-claim={onEditClaim} on:goto-claim={onGotoClaim} />
    {:else}
      No claims at this time.
    {/if}
  </Row>
</Page>
