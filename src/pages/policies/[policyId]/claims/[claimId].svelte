<script lang="ts">
import user from '../../../../authn/user'
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
  ConvertCurrencyLink,
  FileDropArea,
  FilePreview,
  MoneyInput,
  Row,
} from 'components'
import { formatDate } from 'components/dates'
import { loading } from 'components/progress'
import { upload } from 'data'
import { getAccountablePerson, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import {
  denyClaim,
  loadClaims,
  initialized,
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
  loadClaim,
  currentClaim,
} from 'data/claims'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { loadItems, itemsByPolicyId, PolicyItem } from 'data/items'
import { loadPolicies, policies, Policy } from 'data/policies'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { formatMoney } from 'helpers/money'
import { customerClaimEdit, customerClaims, customerClaimDetails } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { onMount } from 'svelte'
import { goto, metatags, params } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let claimId: string
export let policyId: string = $params.policyId

const updatedClaimItemData = {} as any

let showImg: boolean = false
let repairOrReplacementCost: number
let uploading: boolean = false
let previewFile = {} as ClaimFile
let householdId: string = ''
let claimName: string

onMount(async () => {
  loadClaim(claimId)
})

$: claim = $currentClaim
$: claimItem = claim.claim_items?.[0] || ({} as ClaimItem) //For now there will only be one claim_item
$: items = $itemsByPolicyId[claim.policy_id] || []
$: claim.policy_id && loadItems(claim.policy_id)
$: item = items.find((itm) => itm.id === claimItem.item_id) || ({} as PolicyItem)

$: currentUser = $user.policy_id === claim.policy_id

// Accountable persons

$: policyId && loadDependents(policyId)
$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)

$: policyId && loadMembersOfPolicy(policyId)
$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)

$: accountablePersons = [...policyMemberOptions, ...dependentOptions]
$: accountablePersonName = getAccountablePerson(item, accountablePersons)?.name

// policies
$: policyId && loadPolicies()
$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)
$: householdId = policy.household_id ? policy.household_id : ''

$: incidentDate = formatDate(claim.incident_date)
$: claimStatus = (claim.status || '') as ClaimStatus
$: payoutOption = claimItem.payout_option as PayoutOption

$: needsReceipt = claimStatus === 'Receipt'
$: needsFile = needsReceipt || isEvidenceNeeded(claimItem, claimStatus)

$: needsRepairReceipt = needsReceipt && payoutOption === 'Repair'
$: needsReplaceReceipt = needsReceipt && payoutOption === 'Replacement'

$: noFilesUploaded = !claim.claim_files?.length //TODO check for specific file purpose to show banner
$: filePurpose = getFilePurpose(claimItem, needsReceipt)
$: uploadLabel = getUploadLabel(claimItem, needsReceipt, receiptType) as string
$: moneyFormLabel = needsRepairReceipt ? 'Actual cost of repair' : 'Actual cost of replacement'
$: receiptType = needsRepairReceipt ? 'repair' : 'replacement'
$: claimFiles = claim.claim_files || []
$: maximumPayout = determineMaxPayout(payoutOption, claimItem, item.coverage_amount)

// Dynamic breadcrumbs data:
$: item.name && claim.reference_number && (claimName = `${item.name} (${claim.reference_number})`)
const claimsBreadcrumb = { name: 'Claims', url: customerClaims(policyId) }
$: thisClaimBreadcrumb = { name: claimName || 'This item', url: customerClaimDetails(policyId, claimId) }
$: breadcrumbLinks = [claimsBreadcrumb, thisClaimBreadcrumb]
$: claimName && (metatags.title = formatPageTitle(`Claims > ${claimName}`))

const editClaim = () => $goto(customerClaimEdit(policyId, claimId))

const onPreapprove = async () => await preapproveClaim(claimId)

const onApprove = async () => await approveClaim(claimId)

const onAskForChanges = async (event: CustomEvent<string>) => {
  const message = event.detail
  await requestRevision(claimId, message)
}

const onDenyClaim = async (event: CustomEvent<string>) => {
  const message = event.detail
  await denyClaim(claimId, message)
}

const onSubmit = async () => await submitClaim(claimId)

const onPreview = (event: CustomEvent<string>) => {
  showImg = true

  previewFile = claimFiles.find((file) => file.id === event.detail)
}

const onImgError = () => (showImg = false)

const onBlur = () => {
  if (needsRepairReceipt) {
    updatedClaimItemData.repairActual = repairOrReplacementCost
  } else if (needsReplaceReceipt) {
    updatedClaimItemData.replaceActual = repairOrReplacementCost
  }

  claimItem.id && updateClaimItem(claim.id, claimItem.id, updatedClaimItemData)
}

async function onUpload(event: CustomEvent<FormData>) {
  try {
    uploading = true

    const file = await upload(event.detail)

    await claimsFileAttach(claimId, file.id, filePurpose)

    await loadClaims()
  } finally {
    uploading = false
  }
}

function onDeleted(event: CustomEvent<string>) {
  const id = event.detail

  console.log('deleting file: ' + id) //TODO use endpoint when avialable
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
      <b>{accountablePersonName || ''}</b>
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
      <ClaimBanner {claimStatus}>{claim.status_reason || ''}</ClaimBanner>
      {#if needsFile && noFilesUploaded}
        <ClaimBanner claimStatus={`${claimStatus}Secondary`}>
          Upload {uploadLabel} to get reimbursed.
        </ClaimBanner>
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

      {#if showImg}
        <img class="receipt" src={previewFile.file?.url} alt="receipt" on:error={onImgError} />
      {/if}

      <p>
        <ClaimActions
          {noFilesUploaded}
          {needsFile}
          {claim}
          on:ask-for-changes={onAskForChanges}
          on:deny={onDenyClaim}
          on:edit={editClaim}
          on:preapprove={onPreapprove}
          on:approve={onApprove}
          on:submit={onSubmit}
        />
      </p>

      {#if currentUser}
        {#if needsReceipt}
          <MoneyInput bind:value={repairOrReplacementCost} label={moneyFormLabel} on:blur={onBlur} />

          <p class="label ml-1 mt-6px">
            <ConvertCurrencyLink />
          </p>
        {/if}

        {#if needsFile}
          <label for="receipt" class="ml-1">Attach {uploadLabel}</label>

          <FileDropArea class="w-50 mt-10px" raised {uploading} on:upload={onUpload} />
        {/if}
      {/if}

      <FilePreview class="w-50" previews={claimFiles} on:deleted={onDeleted} on:preview={onPreview} />

      <br />
    </Row>
  {/if}
</Page>
