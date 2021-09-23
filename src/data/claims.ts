import { CREATE, GET, UPDATE } from '.'
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

export type State = {
  icon: string
  color: string
  bgColor: string
  title: string
}

export const claims = writable<Claim[]>([])
export const initialized = writable<boolean>(false)
export const warning: State = {
  icon: 'error',
  color: '--mdc-theme-status-warning',
  bgColor: '--mdc-theme-status-warning-bg',
  title: 'Needs changes',
}
export const success: State = {
  icon: 'done',
  color: '--mdc-theme-status-success',
  bgColor: '--mdc-theme-status-success-bg',
  title: 'Approved for repair',
}
export const pending: State = {
  icon: 'watch_later',
  color: '--mdc-theme-neutral-variant',
  bgColor: '--mdc-theme-neutral-bg',
  title: 'Awaiting review',
}
export const states: { [stateName: string]: State } = {
  Revision: {
    icon: 'chat',
    color: '--mdc-theme-primary',
    bgColor: '--mdc-theme-primary-header-bg',
    title: '',
  },
  Draft: {
    icon: 'edit',
    color: '--mdc-theme-primary',
    bgColor: '--mdc-theme-primary-header-bg',
    title: 'Draft',
  },
  Draft2: warning,
  Pending: pending,
  Receipt: success,
  Receipt2: warning,
  Review1: pending,
  Review2: pending,
  Review3: pending,
  Denied: {
    icon: 'remove_circle',
    color: '--mdc-theme-status-error',
    bgColor: '--mdc-theme-status-error-bg',
    title: 'Denied',
  },
  Approved: {
    icon: 'paid',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: 'Approved for payout',
  },
  Paid: {
    icon: 'paid',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: 'Complete',
  },
}

// TODO: add backend endpoints when they get finished
// TODO: uncomment when backend has claims endpoints

export function init(): void {
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
export async function createClaim(item: PolicyItem, claimData): Promise<Claim> {
  const urlPath = `policies/${item.policy_id}/claims`

  const parsedClaim: CreateClaimRequestBody = {
    incident_date: new Date(claimData.lostDate),
    incident_description: claimData.situationDescription,
    incident_type: claimData.lossReason,
  }

  const claim = await CREATE<Claim>(urlPath, parsedClaim)

  claims.update((currClaims) => {
    currClaims.push(claim)
    return currClaims
  })

  return claim
}

export const createClaimItem = async (claimId: string, claimItemData): Promise<ClaimItem> => {
  const urlPath = `claims/${claimId}/items`

  const parsedClaimItem: CreateClaimItemRequestBody = {
    fmv: convertToCents(claimItemData.fairMarketValueUSD),
    is_repairable: claimItemData.isRepairable,
    item_id: claimItemData.itemId,
    payout_option: claimItemData.payoutOption,
    repair_estimate: convertToCents(claimItemData.repairEstimateUSD),
    replace_estimate: convertToCents(claimItemData.replaceEstimateUSD),
  }

  const claimItem = await CREATE<ClaimItem>(urlPath, parsedClaimItem)

  claims.update((claims) => {
    const claim = claims.find((c) => c.id === claimId)
    if (claim) {
      const claimItems = claim.claim_items || []
      claimItems.push(claimItem)
    }
    return claims
  })

  return claimItem
}

/**
 *
 * @description a function to update a claim
 * @export
 * @param {String} claimId
 * @param {Object} newClaimData
 */
export async function updateClaim(claimId: string, newClaimData): Promise<Claim> {
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

  return updatedClaim
}

export async function claimsFileAttach(
  claimId: string,
  fileId: string,
  purpose: ClaimFilePurpose
): Promise<ClaimsFileAttachResponseBody> {
  const data: ClaimsFileAttachRequestBody = {
    file_id: fileId,
    purpose,
  }

  const response = await CREATE<ClaimsFileAttachResponseBody>(`claims/${claimId}/files`, data)

  return response
}

export async function submitClaim(claimId: string): Promise<string> {
  const response = await CREATE<string>(`claims/${claimId}/submit`)

  await loadClaims()

  return response
}

/**
 *
 * @description a function to update a claimItem
 * @export
 * @param {Number} itemId
 */
export async function updateClaimItem(claimItemId: string, claimItemData): Promise<ClaimItem> {
  const parsedData: UpdateClaimItemRequestBody = {
    fmv: convertToCents(claimItemData.fairMarketValueUSD),
    is_repairable: claimItemData.isRepairable,
    payout_option: claimItemData.payoutOption,
    repair_estimate: convertToCents(claimItemData.repairEstimateUSD),
    replace_estimate: convertToCents(claimItemData.replaceEstimateUSD),
    repair_actual: convertToCents(claimItemData.repairActual),
    replace_actual: convertToCents(claimItemData.replaceActual),
  }

  const response = await UPDATE<ClaimItem>(`claim-items/${claimItemId}`, parsedData)

  return response
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

export async function loadClaims(): Promise<Claim[]> {
  const response = await GET<Claim[]>('claims')

  claims.set(response)
  initialized.set(true)

  return response
}

export const getState = (status: string): State => {
  if (states[status] === undefined) {
    console.error('No such state (for claim status):', status, Object.keys(states))
  }
  return states[status || 'Message']
}
