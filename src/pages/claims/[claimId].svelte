<script>
import { Banner, MoneyInput, Row, ClaimBanner } from '../../components'
import { loadClaims, claims, initialized } from '../../data/claims'
import { Button, Page } from '@silintl/ui-components'
import { params } from '@roxi/routify'

$: ! initialized && loadClaims()

$: claim = $claims.find(claim => claim.id === $params.ClaimId)
</script>

<style>
.left-detail {
  margin: 0.5rem 0;
}

.width {
  width: max-content;
}
</style>

<Page layout="grid">
  <Row cols="3">
    <h3 class="mdc-typography--headline5 my-0">Saxophone</h3>
    <div class="left-detail">Claim 12345</div>
    <Banner background="var(--mdc-theme-status-info-bg)"
      color="var(--mdc-theme-status-info)"
      class="width">
      <b>Theft</b>
    </Banner>
    <div class="left-detail">01 Jan 2001</div>
  </Row>
  <Row cols="9">
    <ClaimBanner {claim} />
    <p>
      Description sint blue bottle messenger bag. Vexillologist craft beer
      normcore, taxidermy direct trade paleo echo park brooklyn stumptown lorem
      biodiesel lomo meggings.
    </p>
    <p>
      <b>Covered value</b><br />
      $809.99
    </p>
    <p>
      <b>Maximum payout</b><br />
      $728.99
    </p>
    <p>
      <Button outlined>Edit claim</Button>
    </p>
    <p>
      <MoneyInput label="Actual cost of replacement"></MoneyInput>
    </p>
  </Row>
</Page>
