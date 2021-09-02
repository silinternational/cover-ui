import { CREATE, GET, UPDATE } from "."
import { start, stop } from "../components/progress"
import { writable } from "svelte/store"

export const claims = writable([])
export const initialized = writable(false)
export const warning = {
  icon: 'error',
  color: '--mdc-theme-status-warning',
  bgColor: '--mdc-theme-status-warning-bg',
  title: 'Needs changes',
  actionLabel: 'Make changes',
}
export const success = {
  icon: 'done',
  color: '--mdc-theme-status-success',
  bgColor: '--mdc-theme-status-success-bg',
  title: 'Approved for repair',
  actionLabel: 'View and upload receipt',
}
export const states = {
  Message: {
    icon: 'chat',
    color: '--mdc-theme-primary',
    bgColor: '--mdc-theme-primary-header-bg',
    title: 'From ',
    actionLabel: 'View message',
  },
  Draft: {
    icon: 'edit',
    color: '--mdc-theme-primary',
    bgColor: '--mdc-theme-primary-header-bg',
    title: 'Draft',
    actionLabel: 'Edit claim',
  },
  Pending: {
    icon: 'watch_later',
    color: '--mdc-theme-neutral-variant',
    bgColor: '--mdc-theme-neutral-bg',
    title: 'Awaiting review',
    actionLabel: 'View claim',
  },
  Needs_repair_receipt: success,
  Needs_repair_receipt2: warning,
  Needs_replace_receipt: success,
  Needs_replace_receipt2: warning,
  Denied: {
    icon: 'remove_circle',
    color: '--mdc-theme-status-error',
    bgColor: '--mdc-theme-status-error-bg',
    title: 'Denied',
    actionLabel: 'View denial',
  },
  Approved: success,
  Payout: {
    icon: 'paid',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: 'Approved for payout',
    actionLabel: 'View claim',
  },
  Complete: {
    icon: 'paid',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: 'Complete',
    actionLabel: 'View claim',
  }
}

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
export async function createClaim(item, claimData) {
  const urlPath = `policies/${item.policy_id}/claims`
  start(urlPath)

  const parsedClaim = {
    event_date: new Date(claimData.lostDate),
    event_description: claimData.situationDescription,
    event_type: claimData.lossReason,
  }

  const claim = await CREATE(urlPath, parsedClaim)

  claims.update(currClaims => {
    currClaims.push(claim)
    return currClaims
  })

  stop(urlPath)
  return claim
}

export const createClaimItem = async (claimId, claimItemData) => {
  const urlPath = `claims/${claimId}/items`
  start(urlPath)
  
  const parsedClaimItem = {
    fmv: claimItemData.fairMarketValue,
    is_repairable: claimItemData.repairableSelection === 'repairable',
    item_id: claimItemData.itemId,
    payout_option: claimItemData.payoutOption,
    repair_actual: 0,
    repair_estimate: claimItemData.repairCost,
    replace_actual: 0,
    replace_estimate: 0,
  }
  
  const claimItem = await CREATE(urlPath, parsedClaimItem)
  
  claims.update(claims => {
    const claim = claims.find(c => c.id === claimId) || {}
    const claimItems = claim.claim_items || []
    claimItems.push(claimItem)
    return claims
  })
  
  stop(urlPath)
}

/**
 *
 * @description a function to update a claim
 * @export
 * @param {String} itemId
 * @param {Object} newClaimData
 */
export async function updateClaim(itemId, newClaimData) {
  start(itemId)

  //TODO make sure these properties are what is used in update claim form when it exists
  const parsedData = {
    event_date: newClaimData.event_date,
    event_type: newClaimData.event_type, //TODO will get types from future GET /config endpoint
    event_description: newClaimData.event_description,
  }

  const updatedClaim = await UPDATE(`claims/${itemId}`, parsedData)

  claims.update(currClaims => {
    let i = currClaims.findIndex(clm => clm.itemId === itemId)
    currClaims[i] = updatedClaim
    return currClaims
  })

  stop(itemId)

  return updatedClaim
}

/**
 *
 * @description a function to delete a claim
 * @export
 * @param {Number} itemId 
 */
export function deleteClaim(itemId) {
  start(itemId)

  claims.update(currClaims => currClaims.filter(clm => clm.itemId !== itemId))

  stop(itemId)
}

export function clear() {
  claims.set([])
  initialized.set(false)
}

export async function loadClaims() {
  start('loadClaims')

  let clms = await GET('claims')

  claims.set(clms)

  stop('loadClaims')
  initialized.set(true)
}

export const getState = status => {
  if (states[status] === undefined) {
    console.error('No such state (for claim status):', status, Object.keys(states))
  }
  return states[status || 'Message']
}
