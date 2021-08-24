<script>
import user from '../../authn/user.js'
import { Banner, MoneyInput, Row, ClaimBanner } from '../../components'
import { formatDate } from '../../components/dates.js'
import { upload } from '../../data'
import { loadClaims, claims, initialized } from '../../data/claims'
import { loadItems, itemsByPolicyId } from '../../data/items'
import { goto, params } from '@roxi/routify'
import { Button, Form, Page } from '@silintl/ui-components'

const updatedClaimData = {}

let replacementCost
let uploading = false

$: ! $initialized && loadClaims()

$: claim = $claims.find(clm => clm.id === $params.claimId) || {}
$: claimItem = claim.claim_items?.[0] || {} //For now there will only be one claim_item
$: items = $itemsByPolicyId[$user.policy_id] || []
$: ! items.length && loadItems($user.policy_id)
$: item = items.find(itm => itm.id === claimItem.item_id) || {}
$: eventDate = formatDate(claim.event_date)
$: needsInitialChangesAndReplacement = claim.status === 'Needs_initial_changes' && claim.event_type === 'Theft' //TODOinstead of event_type this will need to allow all replacements

const editClaim = () => $goto(`claims/${$params.claimId}/edit)`)

const onSubmit = () => {
  const cents = replacementCost * 100

  updatedClaimData.replacement_cost = cents
  
  console.log(updatedClaimData) //TODO update claim with replacementCost and file to api
}

async function chosen(event) {
  const formData = new FormData()

  formData.append('file', event.target.files[0])

  try {
    uploading = true

    updatedClaimData.file = await upload(formData)
  } finally {
    uploading = false
  }
}
</script>

<style>
.left-detail {
  margin: 0.5rem 0;
}

.label {
  color: hsla(219, 53%, 7%, .6);
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
      <b>Maximum payout (if approved)</b><br />
      <!-- TODO get the actual maximum amount -->
      {(item.coverage_amount * .7)  || ''}
    </p>
    <p>
      <Button on:click={editClaim} outlined>Edit claim</Button>
    </p>
    {#if needsInitialChangesAndReplacement}
      <Form on:submit={onSubmit}>
        <MoneyInput bind:value={replacementCost} label="Actual cost of replacement" />

        <p class="label ml-1 mt-6px">
          To convert to USD, <a class="label" href="https://www.google.com/search?q=currency+converter">use this converter.</a>
        </p>

        <label for="receipt" class="ml-1">Attach replacement item receipt</label>

        <br/>

        <!-- TODO find a file drop component to replace this -->
        <input id="receipt" type="file" accept="application/pdf,image/*" on:change={chosen} />

        <br/>

        <Button raised>Upload Receipt</Button>
      </Form>
    {/if}
  </Row>
</Page>
