<script>
import user from '../../authn/user.js'
import { Banner, MoneyInput, Row, ClaimBanner } from '../../components'
import { loadClaims, claims, initialized } from '../../data/claims'
import { loadItems, itemsByPolicyId } from '../../data/items'
import { goto, params } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'
import { formatDate } from '../../components/dates.js'

$: ! $initialized && loadClaims()

$: claim = $claims.find(clm => clm.id === $params.claimId) || {}
$: claimItem = claim.claim_items?.[0] || {} //For now there will only be one claim_item
$: items = $itemsByPolicyId[$user.policy_id] || []
$: ! items.length && loadItems($user.policy_id)
$: item = items.find(itm => itm.id === claimItem.item_id) || {}
$: eventDate = formatDate(claim.event_date, "default", {month: 'long', day: 'numeric', year: 'numeric'})

const onClick = () => $goto(`claims/${$params.claimId}/edit)`)
</script>

<style>
.left-detail {
  margin: 0.5rem 0;
}

</style>

<Page layout="grid">
  <Row cols="3">
    <h3 class="mdc-typography--headline5 my-0">{item.name || 'Name unavailable'}</h3>
    <div class="left-detail">Claim {claim.reference_number || '########'}</div>
    <Banner background="var(--mdc-theme-status-info-bg)"
      color="var(--mdc-theme-status-info)"
      class="max-content-width">
      <b>{claim.event_type || ''}</b>
    </Banner>
    <div class="left-detail">{eventDate || ''}</div>
  </Row>
  <Row cols="9">
    <ClaimBanner claimStatus={claim.status} />
    <p>
      {claim.event_description || ''}
    </p>
    <p>
      <b>Covered value</b><br />
      {item.coverage_amount  || ''}
    </p>
    <p>
      <b>Maximum payout</b><br />
      <!-- TODO get the actual maximum amount -->
      {(item.coverage_amount * .7)  || ''}
    </p>
    <p>
      <Button on:click={onClick} outlined>Edit claim</Button>
    </p>
    <p>
      <MoneyInput label="Actual cost of replacement"></MoneyInput>
    </p>
  </Row>
</Page>
