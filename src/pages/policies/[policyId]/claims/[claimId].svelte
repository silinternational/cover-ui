<script lang="ts">
import user, { UserAppRole } from '../../../../authn/user'
import {
  determineMaxPayout,
  getFilePurpose,
  getUploadLabel,
  isEvidenceNeeded,
} from '../../../../business-rules/claim-payout-amount'
import {
  Banner,
  Breadcrumb,
  ClaimActions,
  ClaimBanner,
  MessageBanner,
  ConvertCurrencyLink,
  FileDropArea,
  FilePreview,
  MoneyInput,
  Row,
} from 'components'
import { formatDate } from 'components/dates'
import { loading } from 'components/progress'
import { upload } from 'data'
import {
  denyClaim,
  claimsFileAttach,
  updateClaimItem,
  ClaimItem,
  ClaimStatus,
  ClaimFile,
  PayoutOption,
  preapproveClaim,
  requestRevision,
  submitClaim,
  approveClaim,
  getClaimById,
  Claim,
  claims,
  fixReceipt,
  ClaimFilePurpose,
} from 'data/claims'
import { loadItems, PolicyItem, selectedPolicyItems } from 'data/items'
import { getNameOfPolicy, getPolicyById, loadPolicy, memberBelongsToPolicy, policies, Policy } from 'data/policies'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'
import { formatMoney } from 'helpers/money'
import { customerClaimEdit, customerClaims, customerClaimDetails, POLICIES, policyDetails } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { assertHas } from '../../../../validation/assertions'
import { onMount } from 'svelte'
import { goto, metatags } from '@roxi/routify'
import { Button, Page, setNotice } from '@silintl/ui-components'
import { formatDistanceToNow } from 'date-fns'

export let claimId: string
export let policyId = $selectedPolicyId

const updatedClaimItemData = {} as any

let showImg: boolean = false
let repairOrReplacementCost: number
let uploading: boolean = false
let previewFile = {} as ClaimFile
let householdId: string = ''
let claimName: string
let policy = {} as Policy
let claim = {} as Claim

onMount(() => {
  getClaimById(claimId)
  loadPolicy(policyId)
})

$: claim = ($claims.find((clm: Claim) => clm.id === claimId) || {}) as Claim
$: claimItem = claim.claim_items?.[0] || ({} as ClaimItem) //For now there will only be one claim_item
$: setInitialValues(claimItem)
$: statusText = getClaimStatusText(claim, claimItem)

$: items = $selectedPolicyItems
$: policyId && loadItems(policyId)
$: item = items.find((itm) => itm.id === claimItem.item_id) || ({} as PolicyItem)

$: isMemberOfPolicy = memberBelongsToPolicy($user.id, $policies, policyId)

// policies
$: $policies && (policy = getPolicyById(policyId))
$: householdId = policy.household_id ? policy.household_id : ''

$: incidentDate = formatDate(claim.incident_date)
$: claimStatus = (claim.status || '') as ClaimStatus
$: payoutOption = claimItem.payout_option as PayoutOption
$: showRevisionMessage = claim.status_reason && claimStatus === 'Revision'

$: needsReceipt = claimStatus === 'Receipt'
$: needsFile = needsReceipt || isEvidenceNeeded(claimItem, claimStatus)

$: needsRepairReceipt = needsReceipt && payoutOption === 'Repair'
$: needsReplaceReceipt = needsReceipt && payoutOption === 'Replacement'

$: filePurpose = getFilePurpose(claimItem, needsReceipt) as ClaimFilePurpose
$: noFilesUploaded = !isFileUploadedByPurpose(filePurpose, claimFiles)
$: uploadLabel = getUploadLabel(claimItem, needsReceipt, receiptType)
$: uploadLabelForButton = getUploadLabel(claimItem, needsReceipt, receiptType, false)
$: showUploadButton = ['Receipt', 'Revision'].includes(claimStatus) && !isAdmin
$: moneyFormLabel = needsRepairReceipt ? 'Actual cost of repair' : 'Actual cost of replacement'
$: receiptType = needsRepairReceipt ? 'repair' : 'replacement'
$: claimFiles = claim.claim_files || ([] as ClaimFile[])
$: maximumPayout = determineMaxPayout(payoutOption, claimItem, item.coverage_amount)

// Dynamic breadcrumbs data:
$: item.name && claim.reference_number && (claimName = `${item.name} (${claim.reference_number})`)
$: policyName = getNameOfPolicy(policy)
$: isAdmin = $roleSelection !== UserAppRole.Customer
$: adminBreadcrumbs = isAdmin
  ? [
      { name: 'Policies', url: POLICIES },
      { name: policyName, url: policyDetails(policyId) },
    ]
  : []

const claimsBreadcrumb = { name: 'Claims', url: customerClaims(policyId) }
$: thisClaimBreadcrumb = { name: claimName || 'This item', url: customerClaimDetails(policyId, claimId) }
$: breadcrumbLinks = [...adminBreadcrumbs, claimsBreadcrumb, thisClaimBreadcrumb]
$: claimName && (metatags.title = formatPageTitle(`Claims > ${claimName}`))

const editClaim = () => $goto(customerClaimEdit(policyId, claimId))

const onPreapprove = async () => await preapproveClaim(claimId)

const onApprove = async () => await approveClaim(claimId)

const onAskForChanges = async (event: CustomEvent<string>) => {
  const message = event.detail
  await requestRevision(claimId, message)
}

const onFixReceipt = async (event: CustomEvent<string>) => {
  const message = event.detail
  await fixReceipt(claimId, message)
}

const onDenyClaim = async (event: CustomEvent<string>) => {
  const message = event.detail
  await denyClaim(claimId, message)
}

const onSubmit = async () => {
  await submitClaim(claimId)
  setNotice('Added replacement cost and receipt')
}

const setInitialValues = (claimItem: ClaimItem) => {
  updatedClaimItemData.payoutOption = claimItem.payout_option || payoutOption
  updatedClaimItemData.repairEstimateUSD = claimItem.repair_estimate / 100
  updatedClaimItemData.replaceEstimateUSD = claimItem.replace_estimate / 100
  updatedClaimItemData.fairMarketValueUSD = claimItem.fmv / 100
  updatedClaimItemData.repairActual = claimItem.repair_actual / 100
  updatedClaimItemData.replaceActual = claimItem.replace_actual / 100
  updatedClaimItemData.isRepairable = claimItem.is_repairable
  repairOrReplacementCost = claimItem.repair_actual / 100 || claimItem.replace_actual / 100
}

const onPreview = (event: CustomEvent<string>) => {
  previewFile = claimFiles.find((file) => file.id === event.detail) || ({} as ClaimFile)

  if (previewFile.file?.url) {
    previewFile.file.content_type === 'image/jpeg' && (showImg = true)

    window.open(previewFile.file.url, '_blank')
  }
}

const onImgError = () => (showImg = false)

const onMoneyInputBlur = () => {
  assertHas(
    needsRepairReceipt || needsReplaceReceipt,
    `You do not need to enter a value for payout option: ${payoutOption}`
  )
  if (needsRepairReceipt) {
    updatedClaimItemData.repairActual = repairOrReplacementCost
  } else if (needsReplaceReceipt) {
    updatedClaimItemData.replaceActual = repairOrReplacementCost
  }

  assertHas(
    updatedClaimItemData.repairActual || updatedClaimItemData.replaceActual,
    `Please enter the actual ${receiptType} cost`
  )
  claimItem.id && updateClaimItem(claim.id, claimItem.id, updatedClaimItemData)
}

async function onUpload(event: CustomEvent<FormData>) {
  try {
    uploading = true

    const file = await upload(event.detail)

    filePurpose !== '' && (await claimsFileAttach(claimId, file.id, filePurpose))

    await getClaimById(claimId)
  } finally {
    uploading = false
  }
}

//TODO use endpoint when avialable
// function onDeleted(event: CustomEvent<string>) {
//   const id = event.detail

//   console.log('deleting file: ' + id)
// }

const getClaimStatusText = (claim: Claim, item: ClaimItem) => {
  const updatedAtStr = item.updated_at ? formatDistanceToNow(Date.parse(item.updated_at), { addSuffix: true }) : ''
  const statusChangeStr = claim.status_change ? `${claim.status_change} ` : updatedAtStr ? 'Submitted ' : ''

  return statusChangeStr + updatedAtStr
}

const isFileUploadedByPurpose = (purpose: ClaimFilePurpose, files: ClaimFile[]): boolean => {
  return files.filter((file) => file.purpose === purpose).length > 0
}
</script>

<style>
.left-detail {
  margin: 0.5rem 0;
}

.label {
  color: hsla(219, 53%, 7%, 0.6);
}

.receipt {
  max-width: 400px;
}
</style>

<Page layout="grid">
  {#if !claim || !item.id}
    <Row>
      {#if $loading}
        Loading...
      {:else}
        We could not find that claim. Please <a href={customerClaims(policyId)}>go back</a> and select a claim from the list.
      {/if}
    </Row>
  {:else}
    <Row>
      <Breadcrumb links={breadcrumbLinks} />
    </Row>
    <Row cols="3">
      <h2 class="break-word my-1">{item.name || ''}</h2>
      <b>Covered value</b>
      <div>{formatMoney(item.coverage_amount)}</div>
      <br />
      <b>{item.accountable_person?.name || ''}</b>
      <br />
      <div class="left-detail">
        <b>Household ID</b>
        <div>{householdId}</div>
      </div>
      <Banner
        background="var(--mdc-theme-status-info-bg)"
        color="var(--mdc-theme-status-info)"
        class="max-content-width mt-1"
      >
        <b>{claim.incident_type || ''}</b>
      </Banner>
      <div class="left-detail">
        <b>Claim ID</b>
        <div>{claim.reference_number || '########'}</div>
      </div>
      <div class="left-detail">
        <b>Incident</b>
        <div>{incidentDate || ''}</div>
      </div>
    </Row>
    <Row cols="9">
      <ClaimBanner {claimStatus} {receiptType} {isAdmin}>{statusText}</ClaimBanner>
      {#if needsFile}
        <ClaimBanner claimStatus={`${claimStatus}Secondary`} {isAdmin} class="mt-4px">
          Upload {uploadLabel} to get reimbursed.
        </ClaimBanner>
      {/if}
      {#if showRevisionMessage}
        <MessageBanner class="mt-4px">{claim.status_reason}</MessageBanner>
      {/if}
      <p class="break-word">
        {claim.incident_description || ''}
      </p>
      <p>
        <b>Covered value</b><br />
        {formatMoney(item.coverage_amount)}
      </p>
      <p>
        <b>Maximum payout (if approved)</b><br />
        {formatMoney(maximumPayout)}
      </p>

      <p>
        <ClaimActions
          {noFilesUploaded}
          {needsFile}
          {claim}
          {isAdmin}
          {isMemberOfPolicy}
          {receiptType}
          {payoutOption}
          on:ask-for-changes={onAskForChanges}
          on:deny={onDenyClaim}
          on:edit={editClaim}
          on:fix-receipt={onFixReceipt}
          on:preapprove={onPreapprove}
          on:approve={onApprove}
          on:submit={onSubmit}
        />
      </p>

      {#if isMemberOfPolicy}
        {#if needsReceipt}
          <MoneyInput bind:value={repairOrReplacementCost} label={moneyFormLabel} on:blur={onMoneyInputBlur} />

          <p class="label ml-1 mt-6px">
            <ConvertCurrencyLink />
          </p>
        {/if}

        {#if needsFile}
          <label for="receipt" class="ml-1">Attach {uploadLabel}</label>

          <FileDropArea class="w-50 mt-10px" raised {uploading} on:upload={onUpload} />
        {/if}
      {/if}

      {#if showImg}
        <img class="receipt" src={previewFile.file?.url} alt="document" on:error={onImgError} />
      {/if}

      <FilePreview class="pointer w-50" previews={claimFiles} {isMemberOfPolicy} on:preview={onPreview} />

      {#if showUploadButton}
        <Button raised disabled={noFilesUploaded} on:click={onSubmit}>Upload {uploadLabelForButton}</Button>
      {/if}
      <br />
    </Row>
  {/if}
</Page>
