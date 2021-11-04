import { CREATE, GET, UPDATE } from '.'
import { UserAppRole } from '../authn/user'
import { convertToCents } from 'helpers/money'
import type { PolicyItem } from './items'
import { derived, writable } from 'svelte/store'
import { selectedPolicyId } from './role-policy-selection'

export type PayoutOption = 'Repair' | 'Replacement' | 'FMV' | 'FixedFraction'
export type ClaimItemStatus = 'Pending' | 'Approved' | 'Denied'
export type ClaimIncidentTypeName = string // dynamically defined by the claim-incident-types endpoint
export type ClaimStatus =
  | 'Draft'
  | 'Review1'
  | 'Review2'
  | 'Review3' // TODO: Remove once API is updated to use Review3a / Review3b.
  | 'Review3a'
  | 'Review3b'
  | 'Revision'
  | 'Receipt'
  | 'Approved'
  | 'Paid'
  | 'Denied'
export type ClaimFilePurpose = 'Receipt' | 'Evidence of FMV' | 'Repair Estimate'

export type ClaimFile = {
  claim_id: string
  created_at: string /*Date*/
  file: {
    content_type: string
    created_by_id: string
    id: string
    name: string
    size: number
    url: string
    url_expiration: string /*Date*/
  }
  file_id: string
  id: string
  purpose: ClaimFilePurpose
  updated_at: string /*Date*/
}

export type ClaimItem = {
  claim_id: string
  created_at: string /*Date*/
  fmv: number
  id: string
  is_repairable: boolean
  item: PolicyItem
  item_id: string
  payout_amount: number
  payout_option: PayoutOption
  repair_actual: number
  repair_estimate: number
  replace_actual: number
  replace_estimate: number
  review_date: string /*Date*/
  reviewer_id: string
  status: ClaimItemStatus
  updated_at: string /*Date*/
}

export type Claim = {
  claim_files: ClaimFile[]
  claim_items: ClaimItem[]
  incident_date: string /*Date*/
  incident_description: string
  incident_type: ClaimIncidentTypeName
  id: string
  payment_date: string /*Date*/
  policy_id: string
  reference_number: string
  review_date: string /*Date*/
  reviewer_id: string
  status: ClaimStatus
  status_change: string
  status_reason: string
  total_payout: number
}

export type CreateClaimRequestBody = {
  incident_date: Date
  incident_description: string
  incident_type: ClaimIncidentTypeName
}

export type CreateClaimItemRequestBody = {
  fmv: number
  is_repairable: boolean
  item_id: string
  payout_option: PayoutOption
  repair_estimate: number
  replace_estimate: number
}

export type UpdateClaimRequestBody = {
  incident_date: string /*Date*/
  incident_description: string
  incident_type: ClaimIncidentTypeName
}

export type ClaimsFileAttachRequestBody = {
  file_id: string
  purpose: ClaimFilePurpose
}

export type ClaimsFileAttachResponseBody = {
  claim_id: string
  created_at: string /*Date*/
  file: any
  file_id: string
  id: string
  purpose: ClaimFilePurpose
  updated_at: string /*Date*/
}

export type UpdateClaimItemRequestBody = {
  fmv: number
  is_repairable: boolean
  payout_option: PayoutOption
  repair_estimate: number
  replace_estimate: number
  repair_actual: number
  replace_actual: number
}

export type ClaimsRequestRevisionRequestBody = {
  status_reason: string
}

export type DenyClaimRequestBody = {
  status_reason: string
}

export const claims = writable<Claim[]>([])
export const selectedPolicyClaims = derived([claims, selectedPolicyId], ([claims, selectedPolicyId]) => {
  return claims.filter((c) => c.policy_id === selectedPolicyId)
})
export const initialized = writable<boolean>(false)
export const editableStatuses: ClaimStatus[] = ['Draft', 'Review1', 'Review2', 'Review3', 'Revision', 'Receipt']
export const statusesAwaitingSteward: ClaimStatus[] = ['Review1', 'Review2', 'Review3', 'Review3b']
export const statusesAwaitingSignator: ClaimStatus[] = ['Review1', 'Review2', 'Review3', 'Review3a']

/**
 * Update a claim in our local list (store) of claims.
 *
 * @param {Claim} changedClaim
 */
const updateClaimsStore = (changedClaim: Claim) => {
  claims.update((claims) => {
    const i = claims.findIndex((claim) => claim.id === changedClaim.id)
    if (i === -1) {
      claims.push(changedClaim)
    } else {
      claims[i] = changedClaim
    }
    return claims
  })
}

// TODO: add backend endpoints when they get finished
// TODO: uncomment when backend has claims endpoints

/**
 * Create a new claim for an existing item
 *
 * @export
 * @param {Object} item
 * @param {Object} claimData
 */
export async function createClaim(item: PolicyItem, claimData: any): Promise<Claim> {
  const urlPath = `policies/${item.policy_id}/claims`

  const parsedClaim: CreateClaimRequestBody = {
    incident_date: new Date(claimData.lostDate),
    incident_description: claimData.situationDescription,
    incident_type: claimData.lossReason,
  }

  const claim = await CREATE<Claim>(urlPath, parsedClaim as any)

  claims.update((currClaims) => {
    currClaims.push(claim)
    return currClaims
  })

  return claim
}

export const createClaimItem = async (claimId: string, claimItemData: any): Promise<void> => {
  const urlPath = `claims/${claimId}/items`

  const parsedClaimItem: CreateClaimItemRequestBody = {
    fmv: convertToCents(claimItemData.fairMarketValueUSD),
    is_repairable: claimItemData.isRepairable,
    item_id: claimItemData.itemId,
    payout_option: claimItemData.payoutOption,
    repair_estimate: convertToCents(claimItemData.repairEstimateUSD),
    replace_estimate: convertToCents(claimItemData.replaceEstimateUSD),
  }

  const claimItem = await CREATE<ClaimItem>(urlPath, parsedClaimItem as any)

  claims.update((claims) => {
    const claim = claims.find((c) => c.id === claimId)
    if (claim) {
      const claimItems = claim.claim_items || []
      claimItems.push(claimItem)
    }
    return claims
  })
}

/**
 *
 * @description a function to update a claim
 * @export
 * @param {String} claimId
 * @param {Object} newClaimData
 */
export async function updateClaim(claimId: string, newClaimData: any): Promise<void> {
  const parsedData: UpdateClaimRequestBody = {
    incident_date: new Date(newClaimData.lostDate).toISOString(),
    incident_type: newClaimData.lossReason,
    incident_description: newClaimData.situationDescription,
  }

  const updatedClaim = await UPDATE<Claim>(`claims/${claimId}`, parsedData)

  updateClaimsStore(updatedClaim)
}

/**
approve a claim.
 *
 * @export
 * @param {String} claimId
 */
export const preapproveClaim = async (claimId: string): Promise<void> => {
  const preapprovedClaim = await CREATE<Claim>(`claims/${claimId}/preapprove`)
  updateClaimsStore(preapprovedClaim)
}

/**
 * approve a claim.
 *
 * @export
 * @param {String} claimId
 */
export const approveClaim = async (claimId: string): Promise<void> => {
  const approvedClaim = await CREATE<Claim>(`claims/${claimId}/approve`)
  updateClaimsStore(approvedClaim)
}

/**
 * Request revisions to a claim.
 *
 * @export
 * @param {String} claimId
 * @param {String} reason -- A message from a reviewer detailing the revisions needed.
 */
export const requestRevision = async (claimId: string, reason: string): Promise<void> => {
  const requestBody: ClaimsRequestRevisionRequestBody = {
    status_reason: reason,
  }
  const modifiedClaim = await CREATE<Claim>(`claims/${claimId}/revision`, requestBody)
  updateClaimsStore(modifiedClaim)
}

/**
 * Deny a claim.
 *
 * @export
 * @param {String} claimId
 * @param {String} reason -- A message from a reviewer detailing the reason for the denial.
 */
export const denyClaim = async (claimId: string, reason: string): Promise<void> => {
  const requestBody: DenyClaimRequestBody = {
    status_reason: reason,
  }
  const deniedClaim = await CREATE<Claim>(`claims/${claimId}/deny`, requestBody)
  updateClaimsStore(deniedClaim)
}

/**
 * Admin reverts a claim to request a new/better receipt. Can be used at state "Review2" or "Review3".
 *
 * @export
 * @param {String} claimId
 * @param {String} reason -- A message from a reviewer detailing the reason for the denial.
 */
export const fixReceipt = async (claimId: string, reason: string): Promise<void> => {
  const requestBody: ClaimsRequestRevisionRequestBody = {
    status_reason: reason,
  }
  const changedClaim = await CREATE<Claim>(`claims/${claimId}/receipt`, requestBody)
  updateClaimsStore(changedClaim)
}

export async function claimsFileAttach(claimId: string, fileId: string, purpose: ClaimFilePurpose): Promise<void> {
  const data: ClaimsFileAttachRequestBody = {
    file_id: fileId,
    purpose,
  }

  // TODO: update a store with this response data
  const response = await CREATE<ClaimsFileAttachResponseBody>(`claims/${claimId}/files`, data as any)
}

export async function submitClaim(claimId: string): Promise<void> {
  const response = await CREATE<Claim>(`claims/${claimId}/submit`)

  updateClaimsStore(response)
}

/**
 *
 * @description a function to update a claimItem
 * @export
 * @param {Number} itemId
 */
export async function updateClaimItem(claimId: string, claimItemId: string, claimItemData: any): Promise<void> {
  const parsedData: UpdateClaimItemRequestBody = {
    fmv: convertToCents(claimItemData.fairMarketValueUSD),
    is_repairable: claimItemData.isRepairable,
    payout_option: claimItemData.payoutOption,
    repair_estimate: convertToCents(claimItemData.repairEstimateUSD),
    replace_estimate: convertToCents(claimItemData.replaceEstimateUSD),
    repair_actual: convertToCents(claimItemData.repairActual),
    replace_actual: convertToCents(claimItemData.replaceActual),
  }

  // TODO: update a store with this response data
  const response = await UPDATE<ClaimItem>(`claim-items/${claimItemId}`, parsedData)

  claims.update((currClaims) => {
    const claimsIdx = currClaims.findIndex((c) => c.id === claimId)
    const claimItemIdx = currClaims[claimsIdx]?.claim_items.findIndex((ci) => ci.id === claimItemId)

    if (claimsIdx > -1 && claimItemIdx > -1) {
      currClaims[claimsIdx].claim_items[claimItemIdx] = response
    }

    return currClaims
  })
}

/**
 *
 * @description a function to delete a claim
 * @export
 * @param {Number} itemId
 */
export function deleteClaim(itemId: string): void {
  // TODO: Implement when deleteClaim API is added
  claims.update((currClaims) => currClaims.filter((clm) => clm.id !== itemId))
}

export function clear(): void {
  claims.set([])
  initialized.set(false)
}

/* Returns a filtered list of claims
 * For a normal user, return ALL that user's claims
 * For a steward or signator, only return claims with a status of 'Review'
 */
export async function loadClaims(): Promise<void> {
  const response = await GET<Claim[]>('claims')

  claims.set(response)
  initialized.set(true)
}

export async function getClaimsAwaitingAdmin(adminRole: UserAppRole): Promise<Claim[]> {
  let desiredStatuses: ClaimStatus[] = []
  if (adminRole === UserAppRole.Steward) {
    desiredStatuses = statusesAwaitingSteward
  } else if (adminRole === UserAppRole.Signator) {
    desiredStatuses = statusesAwaitingSignator
  }

  const statusesForQueryString = desiredStatuses.map(encodeURIComponent).join(',')

  return await GET<Claim[]>('claims/?status=' + statusesForQueryString)
}

export async function loadClaimsByPolicyId(policyId: string): Promise<void> {
  const response = await GET<Claim[]>(`policies/${policyId}/claims`)

  response.forEach(updateClaimsStore)
  initialized.set(true)
}

export const getClaimById = async (claimId: string): Promise<Claim> => {
  const url = `claims/${claimId}`
  const response = await GET<Claim>(url)

  updateClaimsStore(response)

  return response
}
