import { CREATE, GET, UPDATE } from '.'
import { start, stop } from '../components/progress'
import { convertToCents } from '../helpers/money'
import type { PolicyItem } from './items'
import { writable } from 'svelte/store'

export type PayoutOption = 'Repair' | 'Replacement' | 'FMV' | 'FixedFraction'
export type ClaimItemStatus = 'Pending' | 'Approved' | 'Denied'
export type ClaimIncidentTypeName = string // dynamically defined by the claim-incident-types endpoint
export type ClaimStatus =
  | 'Draft'
  | 'Review1'
  | 'Review2'
  | 'Review3'
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
  status_reason: string
  total_payout: number
}

export type CreateClaimRequestBody = {
  incident_date: Date
  incident_description: string
  incident_type: ClaimIncidentTypeName
}

export type CreateClaimItemRequestBody = {
  fmv: number | null
  is_repairable: boolean
  item_id: string
  payout_option: PayoutOption
  repair_estimate: number | null
  replace_estimate: number | null
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
  fmv: number | null
  is_repairable: boolean
  payout_option: PayoutOption
  repair_estimate: number | null
  replace_estimate: number | null
  repair_actual: number | null
  replace_actual: number | null
}

export const claims = writable<Claim[]>([])
export const initialized = writable<boolean>(false)

// TODO: add backend endpoints when they get finished
// TODO: uncomment when backend has claims endpoints

export function init() {
  loadClaims()
}

/**
 * Create a new claim for an existing item
 *
 * @export
 * @param {Object} item
 * @param {Object} claimData
 * @return {Object} -- The newly created Claim
 */
export async function createClaim(item: PolicyItem, claimData: any) {
  const urlPath = `policies/${item.policy_id}/claims`
  start(urlPath)

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

  stop(urlPath)
  return claim
}

export const createClaimItem = async (claimId: string, claimItemData: any) => {
  const urlPath = `claims/${claimId}/items`
  start(urlPath)
  try {
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
  } finally {
    stop(urlPath)
  }
}

/**
 *
 * @description a function to update a claim
 * @export
 * @param {String} claimId
 * @param {Object} newClaimData
 */
export async function updateClaim(claimId: string, newClaimData: any) {
  start(claimId)

  const parsedData: UpdateClaimRequestBody = {
    incident_date: new Date(newClaimData.lostDate).toISOString(),
    incident_type: newClaimData.lossReason,
    incident_description: newClaimData.situationDescription,
  }

  const updatedClaim = await UPDATE<Claim>(`claims/${claimId}`, parsedData)

  claims.update((currClaims) => {
    const i = currClaims.findIndex((clm) => clm.id === claimId)
    currClaims[i] = updatedClaim
    return currClaims
  })

  stop(claimId)

  return updatedClaim
}

export async function claimsFileAttach(claimId: string, fileId: string, purpose: ClaimFilePurpose) {
  start(fileId)

  const data: ClaimsFileAttachRequestBody = {
    file_id: fileId,
    purpose,
  }
  await CREATE<ClaimsFileAttachResponseBody>(`claims/${claimId}/files`, data as any)

  stop(fileId)
}

export async function submitClaim(claimId: string) {
  start(claimId)

  await CREATE<string>(`claims/${claimId}/submit`)

  await loadClaims()

  stop(claimId)
}

/**
 *
 * @description a function to update a claimItem
 * @export
 * @param {Number} itemId
 */
export async function updateClaimItem(claimItemId: string, claimItemData: any) {
  start(claimItemId)

  const parsedData: UpdateClaimItemRequestBody = {
    fmv: convertToCents(claimItemData.fairMarketValueUSD),
    is_repairable: claimItemData.isRepairable,
    payout_option: claimItemData.payoutOption,
    repair_estimate: convertToCents(claimItemData.repairEstimateUSD),
    replace_estimate: convertToCents(claimItemData.replaceEstimateUSD),
    repair_actual: convertToCents(claimItemData.repairActual),
    replace_actual: convertToCents(claimItemData.replaceActual),
  }

  await UPDATE<ClaimItem>(`claim-items/${claimItemId}`, parsedData)

  stop(claimItemId)
}

/**
 *
 * @description a function to delete a claim
 * @export
 * @param {Number} itemId
 */
export function deleteClaim(itemId: string) {
  start(itemId)

  claims.update((currClaims) => currClaims.filter((clm) => clm.id !== itemId))

  stop(itemId)
}

export function clear() {
  claims.set([])
  initialized.set(false)
}

export async function loadClaims() {
  start('loadClaims')

  const clms = await GET<Claim[]>('claims')

  claims.set(clms)

  stop('loadClaims')
  initialized.set(true)
}
