<script lang="ts">
import user from '../../../authn/user'
import { determineMaxPayout, isEvidenceNeeded } from '../../../business-rules/claim-payout-amount'
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
} from '../../../components'
import { formatDate } from '../../../components/dates'
import { loading } from '../../../components/progress'
import { upload } from '../../../data'
import { getAccountablePerson, getDependentOptions, getPolicyMemberOptions } from '../../../data/accountablePersons'
import {
  denyClaim,
  loadClaims,
  claims,
  initialized,
  claimsFileAttach,
  updateClaimItem,
  Claim,
  ClaimItem,
  ClaimStatus,
  ClaimFile,
  ClaimFilePurpose,
  PayoutOption,
  preapproveClaim,
  requestRevision,
  submitClaim,
} from '../../../data/claims'
import { dependentsByPolicyId, loadDependents } from '../../../data/dependents'
import { loadItems, itemsByPolicyId, PolicyItem } from '../../../data/items'
import { loadPolicies, policies, Policy } from '../../../data/policies'
import { loadMembersOfPolicy, membersByPolicyId } from '../../../data/policy-members'
import { formatMoney } from '../../../helpers/money'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let claimId: string

const updatedClaimItemData = {} as any

let showImg: boolean = false
let repairOrReplacementCost: number
let uploading: boolean = false
let previewFile = {} as ClaimFile
let householdId: string = ''

$: $initialized || loadClaims()

$: claim = $claims.find((clm) => clm.id === claimId) || ({} as Claim)
$: claimItem = claim.claim_items?.[0] || ({} as ClaimItem) //For now there will only be one claim_item
$: items = $itemsByPolicyId[claim.policy_id] || []
$: claim.policy_id && loadItems(claim.policy_id)
$: item = items.find((itm) => itm.id === claimItem.item_id) || ({} as PolicyItem)

// Accountable persons
$: policyId = $user.policy_id as string

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
$: claimStatus === 'Draft' && $user.app_role === 'User' && editClaim()
$: payoutOption = claimItem.payout_option as PayoutOption
$: needsRepairReceipt = needsReceipt && payoutOption === 'Repair'
$: needsReplaceReceipt = needsReceipt && payoutOption === 'Replacement'
$: needsReceipt = claimStatus === 'Receipt'
$: needsEvidence = isEvidenceNeeded(claimItem, claimStatus)
$: needsFile = (needsReceipt || needsEvidence) as boolean
$: filePurpose = getFilePurpose(claimItem, needsReceipt)
$: uploadLabel = getUploadLabel(claimItem, needsReceipt, receiptType) as string
$: moneyFormLabel = needsRepairReceipt ? 'Actual cost of repair' : 'Actual cost of replacement'
$: receiptType = needsRepairReceipt ? 'repair' : 'replacement'
$: claimFiles = claim.claim_files || []
$: maximumPayout = determineMaxPayout(payoutOption, claimItem, item.coverage_amount)

// Dynamic breadcrumbs data:
$: claimName = `${item.name} (${claim.reference_number})`
const claimsBreadcrumb = { name: 'Claims', url: '/customer/claims' }
$: thisClaimBreadcrumb = { name: claimName || 'This item', url: `/customer/claims/${claimId}` }
$: breadcrumbLinks = [claimsBreadcrumb, thisClaimBreadcrumb]

const getFilePurpose = (claimItem: ClaimItem, needsReceipt: boolean): ClaimFilePurpose => {
  if (needsReceipt) return 'Receipt'
  if (claimItem.repair_estimate) return 'Repair Estimate'
  if (claimItem.fmv) return 'Evidence of FMV'
}

const getUploadLabel = (claimItem: ClaimItem, needsReceipt: boolean, receiptType) => {
  if (needsReceipt) return `a ${receiptType} item receipt`
  if (claimItem.repair_estimate) return 'a repair estimate'
  if (claimItem.fmv) return 'evidence of fair market value'
}

const editClaim = () => $goto(`/customer/claims/${claimId}/edit`)

const onPreapprove = async () => await preapproveClaim(claimId)

const onAskForChanges = async (event) => {
  const message = event.detail
  await requestRevision(claimId, message)
}

const onDenyClaim = async (event) => {
  const message = event.detail
  await denyClaim(claimId, message)
}

const onSubmit = async () => await submitClaim(claimId)

const onPreview = (event) => {
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
  color: hsla(219, 53%, 7%, 0.6);
}

.receipt {
  max-width: 400px;
}
</style>

<Page layout="grid">
  {#if !item.id}
    <Row>
      {#if $loading}
        Loading...
      {:else}
        We could not find that claim. Please <a href="/claims">go back</a> and select a claim from the list.
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
      {#if needsFile}
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
          {claim}
          on:ask-for-changes={onAskForChanges}
          on:deny={onDenyClaim}
          on:edit={editClaim}
          on:preapprove={onPreapprove}
          on:submit={onSubmit}
        />
      </p>

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

      <FilePreview class="w-50" previews={claimFiles} on:deleted={onDeleted} on:preview={onPreview} />

      <br />
    </Row>
  {/if}
</Page>
