<script>
import user from '../../authn/user.js'
import { Banner, ClaimBanner, ConvertCurrencyLink, FileDropArea, MoneyInput, Row } from '../../components'
import { formatDate } from '../../components/dates.js'
import { upload } from '../../data'
import { loadClaims, claims, initialized, claimsFileAttach, updateClaimItem } from '../../data/claims'
import { loadItems, itemsByPolicyId } from '../../data/items'
import { goto } from '@roxi/routify'
import { Button, Form, Page, Progress } from '@silintl/ui-components'
import { flip } from 'svelte/animate'
import { fly } from 'svelte/transition'

export let claimId

const updatedClaimItemData = {}
const showImg = []

let repairOrReplacementCost
let uploading = false
let deductible = .05
let maximumPayout = ''

$: $initialized || loadClaims()

$: claim = $claims.find(clm => clm.id === claimId) || {}
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
$: claimFiles = claim.claim_files || []
$: showImages(claimFiles.length)
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

const editClaim = () => $goto(`claims/${claimId}/edit)`)

const showImages = length => {
  for (let i = 0; i < length; i++) {
    showImg[i] = true
  }
}

const onImgError = id => showImg[id] = false

const onBlur = () => {
  const cents = repairOrReplacementCost * 100

  if (needsRepairReceipt) {
    updatedClaimItemData.repairActual = cents
  } else if (needsReplaceReceipt) {
    updatedClaimItemData.replaceActual = cents
  }

  claimItem.id && updateClaimItem(claimItem.id, updatedClaimItemData) //TODO, test when claimItems is no longer empty
}

async function onUpload(event) {
  try {
    uploading = true

    const file = await upload(event.detail)

    await claimsFileAttach(claimId, file.id)

    await loadClaims()

  } finally {
    uploading = false
  }
}

function onDeleted(event) {
  const id = event.detail

  console.log('deleting file: ' + id) //TODO use endpoint when avialable
}
</script>

<style>
.left-detail {
  margin: 0.5rem 0;
}

.label {
  color: hsla(219, 53%, 7%, .6);
}

.receipt {
  max-width: 400px;
}
.preview {
  background-color: hsla(213, 26%, 23%, 1);
}
.preview img {
  max-width: 50px;
  vertical-align: middle;
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

    {#if claimFiles.length}
      <div class="flex column">
        {#each claimFiles as file, i}
          {#if showImg[i]}
            <img class='receipt' src={file.file.url} alt='receipt' on:error={() => onImgError(i)}/>
          {/if}
        {/each}
      </div>
    {/if}

    <p>
      <Button on:click={editClaim} outlined>Edit claim</Button>
    </p>
    {#if needsReceipt}
      <Form>
        <MoneyInput bind:value={repairOrReplacementCost} label={moneyFormLabel} on:blur={onBlur}/>

        <p class="label ml-1 mt-6px">
          <ConvertCurrencyLink />
        </p>

        <label for="receipt" class="ml-1">Attach replacement item receipt</label>

        <br/>

        <div>
          <FileDropArea class="w-50" raised previews={claimFiles} {uploading} on:upload={onUpload} on:deleted={onDeleted}/>

          <div class="mt-10px py-10px">
            {#each claimFiles as preview (preview.id)}
              <div transition:fly={{ y: 200, duration: 1500 }} animate:flip={{duration: 500}} class="preview flex justify-between align-items-center br-8px p-10px mb-1">
                <!-- <img class="br-8px mr-10px" src={preview.src} alt={'receipt'} /> -->
                <div>
                  <p class="white">{preview.file.name}</p>
                  <p class="white">{preview.created_at}</p>
                </div>
                <Button class="delete-button" raised on:click={evt => onDelete(evt, preview.id)}>Delete</Button>
              </div>
            {/each}
            {#if uploading}
              <Progress.Circular />
            {/if}
          </div>
        </div>


        <br/>
      </Form>
    {/if}
  </Row>
</Page>
