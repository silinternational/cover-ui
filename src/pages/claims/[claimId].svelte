<script>
import user from '../../authn/user.js'
import { Banner, ConvertCurrencyLink, MoneyInput, Row, ClaimBanner } from '../../components'
import { formatDate } from '../../components/dates.js'
import { upload } from '../../data'
import { loadClaims, claims, initialized } from '../../data/claims'
import { loadItems, itemsByPolicyId } from '../../data/items'
import { goto, params } from '@roxi/routify'
import { Button, Form, Page } from '@silintl/ui-components'

const updatedClaimData = {}

let repairOrReplacementCost
let uploading = false
let deductible = .05
let maximumPayout = ''

$: $initialized || loadClaims()

$: claim = $claims.find(clm => clm.id === $params.claimId) || {}
$: claimItem = claim.claim_items?.[0] || {} //For now there will only be one claim_item
$: items = $itemsByPolicyId[$user.policy_id] || []
$: $user.policy_id && loadItems($user.policy_id)
$: item = items.find(itm => itm.id === claimItem.item_id) || {}
$: eventDate = formatDate(claim.event_date)
$: status = claim.status || ''
$: payoutOption = claimItem.payout_option
$: needsRepairReceipt = (status === 'Needs_repair_receipt')
$: needsReplaceReceipt = (status === 'Needs_replace_receipt')
$: needsReceipt = (needsRepairReceipt || needsReplaceReceipt)
$: moneyFormLabel = needsRepairReceipt ? "Actual cost of repair" : "Actual cost of replacement"
$: receiptType = needsRepairReceipt ? 'repair' : 'replacement'
$: if(payoutOption === 'repair') {
    maximumPayout = computeRepairMaxPayout()
  } else if(payoutOption === 'replacement') {
    maximumPayout = computeReplaceMaxPayout()
  } else if(payoutOption === 'fmv') {
    maximumPayout = computeCashMaxPayout()
  } else if(claim.event_type === 'Evacuation') {
    maximumPayout = claimItem.coverage_amount * 2/3 || ''
  }

const computePayout = (...values) => Math.min(...values) * (1 - deductible) || ''

const computeRepairMaxPayout = () => computePayout(claimItem.repair_estimate || claimItem.repair_actual, claimItem.coverage_amount, claimItem.fmv)

const computeReplaceMaxPayout = () => computePayout(claimItem.replace_estimate, claimItem.coverage_amount)

const computeCashMaxPayout = () => computePayout(claimItem.coverage_amount, claimItem.fmv)

const editClaim = () => $goto(`claims/${$params.claimId}/edit)`)

const onSubmit = () => {
  const cents = repairOrReplacementCost * 100

  //TODO update this when the claimUpdate payload is defined
  if (needsRepairReceipt) {
    updatedClaimData.repair_actual = cents
  } else if (needsReplaceReceipt) {
    updatedClaimData.replace_actual = cents
  }
  
  console.log(updatedClaimData) //TODO update claim with repairOrReplacementCost and file to api
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
    <ClaimBanner claimStatus={status} />
    {#if needsReceipt}
      <ClaimBanner claimStatus={`${status}2`} >
        Upload a {receiptType} receipt to get reimbursed.
      </ClaimBanner>
    {/if}
    <p>
      {claim.event_description || ''}
    </p>
    <p>
      <b>Covered value</b><br />
      {item.coverage_amount  || ''}
    </p>
    <p>
      <b>Maximum payout (if approved)</b><br />
      {maximumPayout}
    </p>
    <p>
      <Button on:click={editClaim} outlined>Edit claim</Button>
    </p>
    {#if needsReceipt}
      <Form on:submit={onSubmit}>
        <MoneyInput bind:value={repairOrReplacementCost} label={moneyFormLabel} />

        <p class="label ml-1 mt-6px">
          <ConvertCurrencyLink />
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
