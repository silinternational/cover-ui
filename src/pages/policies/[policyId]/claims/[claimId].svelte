<script lang="ts">
import user, { isCustomer, UserAppRole } from 'data/user'
import { getFilePurpose, getUploadLabel, isEvidenceNeeded } from '../../../../business-rules/claim-payout-amount'
import {
  Banner,
  Breadcrumb,
  ClaimActions,
  ClaimBanner,
  ConvertCurrencyLink,
  FilePreviews,
  MessageBanner,
  NewCoverageModal,
  Row,
  RevokeModal,
} from 'components'
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
  ReceiptType,
  claimFilesDelete,
  deleteClaim,
  updateClaim,
} from 'data/claims'
import { getNameOfPolicy, getPolicyById, loadPolicy, memberBelongsToPolicy, policies, Policy } from 'data/policies'
import type { SecondaryClaimStatus } from 'data/states'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'
import { addItem, loadItems, parseItemForAddItem, selectedPolicyItems } from 'data/items'
import { formatFriendlyDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import {
  customerClaimEdit,
  customerClaims,
  customerClaimDetails,
  POLICIES,
  policyDetails,
  itemEdit,
} from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { assertHas } from '../../../../validation/assertions'
import { onMount } from 'svelte'
import { goto, metatags } from '@roxi/routify'
import { Button, FileDropArea, MoneyInput, Page, setNotice } from '@silintl/ui-components'
import { formatDistanceToNow } from 'date-fns'
import type { PolicyItem } from 'data/types/items'

export let claimId: string
export let policyId = $selectedPolicyId

const updatedClaimItemData = {} as any

let showImg = false
let repairOrReplacementCost: number
let uploading = false
let previewFile = {} as ClaimFile
let householdId: string = ''
let claimName: string
let policy = {} as Policy
let claim = {} as Claim
let minimumDeductible: number | undefined
let revokeModalOpen = false
let newCoverageModalOpen = false

onMount(() => {
  getClaimById(claimId)
  loadPolicy(policyId)
})

$: claim = ($claims.find((clm: Claim) => clm.id === claimId) || {}) as Claim
$: claimItem = claim.claim_items?.[0] || ({} as ClaimItem) //For now there will only be one claim_item
$: setInitialValues(claimItem)
$: statusText = getClaimStatusText(claim, claimItem)
$: claimStatusSecondary = `${claimStatus}Secondary` as SecondaryClaimStatus

$: items = $selectedPolicyItems
$: policyId && loadItems(policyId)
$: item = items.find((itm) => itm.id === claimItem.item_id) || ({} as PolicyItem)
$: minimumDeductible = item?.category?.minimum_deductible

$: isMemberOfPolicy = memberBelongsToPolicy($user.id, $policies, policyId)

// policies
$: $policies && (policy = getPolicyById(policyId))
$: householdId = policy.household_id ? policy.household_id : ''

$: incidentDate = formatFriendlyDate(claim.incident_date)
$: claimStatus = (claim.status || '') as ClaimStatus
$: payoutOption = claimItem.payout_option
$: needsRevision = claimStatus === ClaimStatus.Revision
$: showRevisionMessage = claim.status_reason && needsRevision
$: showSecondaryBanner = needsFile && isCustomer($roleSelection)

$: needsReceipt = claimStatus === ClaimStatus.Receipt
$: needsFile = needsReceipt || isEvidenceNeeded(claimItem, claimStatus)
$: allowDelete = needsRevision || [ClaimStatus.Receipt, ClaimStatus.Draft].includes(claimStatus)

$: isRepair = payoutOption === PayoutOption.Repair
$: needsRepairReceipt = needsReceipt && payoutOption === PayoutOption.Repair
$: needsReplaceReceipt = needsReceipt && payoutOption === PayoutOption.Replacement

$: filePurpose = getFilePurpose(claimItem, needsReceipt) as ClaimFilePurpose | ''
$: noFilesUploaded = !isFileUploadedByPurpose(filePurpose, claimFiles)
$: uploadLabel = getUploadLabel(claimItem, needsReceipt, receiptType)
$: uploadLabelForButton = needsFile
  ? `upload ${getUploadLabel(claimItem, needsReceipt, receiptType, false)}`
  : 'submit changes'
$: showUploadButton = [ClaimStatus.Receipt, ClaimStatus.Revision].includes(claimStatus) && !isAdmin
$: moneyFormLabel = isRepair ? 'Actual cost of repair' : 'Actual cost of replacement'
$: receiptType = isRepair ? ReceiptType.repair : ReceiptType.replacement
$: claimFiles = claim.claim_files || ([] as ClaimFile[])
$: maximumPayout = claim.total_payout || 0
$: payoutLabel = claimStatus !== ClaimStatus.Paid ? 'Maximum payout (if approved)' : 'Payout'

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

const claimsBreadcrumb = { name: 'Claims', url: customerClaims(policyId), icon: 'assignment' }
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
  const didNeedFile = needsFile
  const oldUploadLabel = uploadLabel
  await submitClaim(claimId)
  setNotice(didNeedFile ? `Added replacement cost and ${oldUploadLabel}` : 'Submitted changes')
}
const onRevoke = async (e: CustomEvent): Promise<void> => {
  if (e.detail === 'delete') {
    await deleteClaim(claimId)
    setNotice('Deleted Claim')
    $goto(customerClaims(policyId))
  } else if (e.detail === 'update') {
    const updatedClaimData = {
      lostDate: claim.incident_date,
      lossReason: claim.incident_type,
      situationDescription: claim.incident_description,
    }
    await updateClaim(claimId, updatedClaimData)
    setNotice('Revoked Claim')
    $goto(customerClaimDetails(policyId, claimId))
  }
  revokeModalOpen = false
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
    if (payoutOption === PayoutOption.Replacement) {
      newCoverageModalOpen = true
    }
  }
}

function onDeleted(event: CustomEvent<string>) {
  const id = event.detail

  claimFilesDelete(claimId, id)
}

const getClaimStatusText = (claim: Claim, item: ClaimItem) => {
  const updatedAtStr = item.updated_at ? formatDistanceToNow(Date.parse(item.updated_at), { addSuffix: true }) : ''
  const statusChangeStr = claim.status_change ? `${claim.status_change} ` : updatedAtStr ? 'Submitted ' : ''

  return statusChangeStr + updatedAtStr
}

const isFileUploadedByPurpose = (purpose: ClaimFilePurpose | '', files: ClaimFile[]): boolean => {
  return files.filter((file) => file.purpose === purpose).length > 0
}

const onReCover = async () => {
  const newItem = await addItem(policyId, parseItemForAddItem(item))

  $goto(itemEdit(policyId, newItem.id))
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
      <h2 class="my-1 tw-break-words">{item.name || ''}</h2>

      <b>Covered value</b>
      <div>{formatMoney(claimItem.coverage_amount)}</div>
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
      <ClaimBanner {claimStatus} roleSelection={$roleSelection} {receiptType}>{statusText}</ClaimBanner>
      {#if showSecondaryBanner}
        <ClaimBanner claimStatus={claimStatusSecondary} roleSelection={$roleSelection} class="mt-4px">
          Upload {uploadLabel} to get reimbursed.
        </ClaimBanner>
      {/if}
      {#if showRevisionMessage}
        <MessageBanner class="mt-4px">{claim.status_reason}</MessageBanner>
      {/if}
      <p class="tw-break-words">
        {claim.incident_description || ''}
      </p>
      <div>
        <h2>Resolution</h2>
        <h3>{payoutOption || 'No payout option selected'}</h3>
        {#if payoutOption == PayoutOption.Replacement}
          {#if minimumDeductible}
            <p>
              Payout is the item’s covered value or replacement cost, whichever is less, minus the greater of a {formatMoney(
                minimumDeductible
              )} minimum or 5% of claimed loss.
            </p>
          {:else}
            <p>Payout is the item’s covered value or replacement cost, whichever is less, minus a 5% deductible.</p>
          {/if}
        {/if}
      </div>
      <p>
        <b>Covered value</b><br />
        {formatMoney(claimItem.coverage_amount)}
      </p>
      <p>
        <b>{payoutLabel}</b><br />
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
          on:delete={() => (revokeModalOpen = true)}
        />
      </p>

      {#if isMemberOfPolicy}
        {#if needsReceipt}
          <span class="d-block mb-half">{moneyFormLabel}</span>
          <MoneyInput minValue={'0'} bind:value={repairOrReplacementCost} on:blur={onMoneyInputBlur} />

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

      <FilePreviews
        class="pointer w-50"
        {allowDelete}
        previews={claimFiles}
        on:preview={onPreview}
        on:deleted={onDeleted}
      />

      {#if showUploadButton}
        <Button raised disabled={noFilesUploaded} on:click={onSubmit}>{uploadLabelForButton}</Button>
      {/if}
      <br />
    </Row>
  {/if}

  <RevokeModal {claim} open={revokeModalOpen} on:closed={onRevoke} />
  <NewCoverageModal
    itemName={item.name}
    open={newCoverageModalOpen}
    on:reCover={onReCover}
    on:cancel={() => (newCoverageModalOpen = false)}
    on:closed={() => (newCoverageModalOpen = false)}
  />
</Page>
