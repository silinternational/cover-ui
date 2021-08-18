<script>
import { claims, initialized, loadClaims } from '../data/claims.js'
import { ClaimCards, Row } from '../components/'
import { Page, Button } from '@silintl/ui-components'

$: $initialized || loadClaims()
</script>

<Page layout="grid">
  <Row cols={'12'}>
    <Button raised url="/claims/newClaim">New claim</Button>
  </Row>

  <Row cols={'12'}>
    {#if $claims.length}
      <ClaimCards items={$claims} />
    {:else}
      No claims at this time.
    {/if}
  </Row>
</Page>
