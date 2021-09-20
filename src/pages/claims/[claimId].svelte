<script lang="ts">
import user from '../../authn/user.js'
import {
  Banner,
  ClaimActionButtons,
  ClaimBanner,
  ConvertCurrencyLink,
  FileDropArea,
  FilePreview,
  MoneyInput,
  Row,
} from '../../components'
import { formatDate } from '../../components/dates.js'
import { upload } from '../../data'
import { loadClaims, claims, initialized, claimsFileAttach, updateClaimItem, Claim, ClaimItem, ClaimFile, ClaimFilePurpose, PayoutOption, submitClaim } from '../../data/claims'
import { loadItems, itemsByPolicyId, PolicyItem } from '../../data/items'
import { formatMoney } from '../../helpers/money'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let claimId: string

const updatedClaimItemData = {} as any

let showImg = false
let repairOrReplacementCost: number
let uploading = false
let deductible = .05
let maximumPayout: string
let previewFile = {} as ClaimFile

$: $initialized || loadClaims()

$: claim = $claims.find(clm => clm.id === claimId) || {} as Claim
$: claimItem = claim.claim_items?.[0] || {} as ClaimItem //For now there will only be one claim_item
$: items = $itemsByPolicyId[claim.policy_id] || []
$: claim.policy_id && loadItems(claim.policy_id)
$: item = items.find(itm => itm.id === claimItem.item_id) || {} as PolicyItem
$: incidentDate = formatDate(claim.incident_date)
$: status = claim.status || ''
$: payoutOption = claimItem.payout_option as PayoutOption
$: needsRepairReceipt = (needsReceipt && (payoutOption === 'Repair'))
$: needsReplaceReceipt = (needsReceipt && (payoutOption === 'Replacement'))
$: needsReceipt = (status === 'Receipt')
$: needsEvidence = ((claimItem.fmv || claimItem.repair_estimate) && status === 'Draft') as Boolean
$: needsFile = (needsReceipt || needsEvidence) as Boolean
$: filePurpose = getFilePurpose(claimItem, needsReceipt)
$: uploadLabel = getUploadLabel(claimItem, needsReceipt, receiptType) as string
$: moneyFormLabel = needsRepairReceipt ? "Actual cost of repair" : "Actual cost of replacement"
$: receiptType = needsRepairReceipt ? 'repair' : 'replacement'
$: claimFiles = claim.claim_files || []
$: if(payoutOption === 'Repair') {
    maximumPayout = computeRepairMaxPayout()
  } else if(payoutOption === 'Replacement') {
    maximumPayout = computeReplaceMaxPayout()
  } else if(payoutOption === 'FMV') {
    maximumPayout = computeCashMaxPayout()
  } else if(claim.incident_type === 'Evacuation') {
    maximumPayout = formatMoney(item.coverage_amount * 2/3) || ''
  }

const computePayout = (...values) => formatMoney(Math.min(...values) * (1 - deductible)) || ''

const computeRepairMaxPayout = () => computePayout(claimItem.repair_estimate || claimItem.repair_actual, item.coverage_amount, claimItem.fmv)

const computeReplaceMaxPayout = () => computePayout(claimItem.replace_estimate, item.coverage_amount)

const computeCashMaxPayout = () => computePayout(item.coverage_amount, claimItem.fmv)

const getFilePurpose = (claimItem: ClaimItem, needsReceipt: Boolean): ClaimFilePurpose => {
  if(needsReceipt) return 'Receipt'
  if(claimItem.repair_estimate) return 'Repair Estimate'
  if(claimItem.fmv) return 'Evidence of FMV'
}

const getUploadLabel = (claimItem: ClaimItem, needsReceipt: Boolean, receiptType) => {
  if(needsReceipt) return `a ${receiptType} item receipt`
  if(claimItem.repair_estimate) return 'a repair estimate'
  if(claimItem.fmv) return 'evidence of fair market value'
}

const editClaim = () => $goto(`/claims/${claimId}/edit`)

const onSubmit = async () => await submitClaim(claimId)

const onPreview = event => {
  showImg = true
  
  previewFile = claimFiles.find(file => file.id === event.detail)
}

const onImgError = () => showImg = false

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

    await claimsFileAttach(claimId, file.id, filePurpose)

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
</style>

<Page layout="grid">
  <Row cols="3">
    <h3 class="mdc-typography--headline5 my-0">{item.name || 'Name unavailable'}</h3>
    <div class="left-detail">Claim {claim.reference_number || '########'}</div>
    <Banner background="var(--mdc-theme-status-info-bg)"
      color="var(--mdc-theme-status-info)"
      class="max-content-width">
      <b>{claim.incident_type || ''}</b>
    </Banner>
    <div class="left-detail">{incidentDate || ''}</div>
  </Row>
  <Row cols="9">
    <ClaimBanner claimStatus={status} >{claim.status_reason || ''}</ClaimBanner>
    {#if needsFile}
      <ClaimBanner claimStatus={`${status}2`} >
        Upload {uploadLabel} to get reimbursed.
      </ClaimBanner>
    {/if}
    <p>
      {claim.incident_description || ''}
    </p>
    <p>
      <b>Covered value</b><br />
      {formatMoney(item.coverage_amount)}
    </p>
    <p>
      <b>Maximum payout (if approved)</b><br />
      {maximumPayout}
    </p>

    {#if showImg}
      <img class='receipt' src={previewFile.file?.url} alt='receipt' on:error={onImgError}/>
    {/if}

    <p>
      <ClaimActionButtons {claim} on:edit={editClaim} on:submit={onSubmit} />
    </p>

    {#if needsReceipt}
      <MoneyInput bind:value={repairOrReplacementCost} label={moneyFormLabel} on:blur={onBlur}/>
      
      <p class="label ml-1 mt-6px">
        <ConvertCurrencyLink />
      </p>
    {/if}

    {#if needsFile}
      <label for="receipt" class="ml-1">Attach {uploadLabel}</label>
    
      <FileDropArea class="w-50 mt-10px" raised {uploading} on:upload={onUpload} />
    {/if}
      
    <FilePreview class="w-50" previews={claimFiles} on:deleted={onDeleted} on:preview={onPreview} />

    <br/>
  </Row>
</Page>
