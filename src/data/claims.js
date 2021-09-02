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
 *
 * @description a function to create a new claim for an existing item
 * @export
 * @param {Object} item
 * @param {Object} claimData
 */
export async function createClaim(item, claimData) {
  start(item.id)

  // TODO: make an item field to store details about claim item
  let parsedClaim = {
    event_date: new Date(claimData.lostDate),
    event_description: claimData.situationDescription,
    event_type: claimData.lossReason,
  }

  const claim = await CREATE(`policies/${item.policy_id}/claims`, parsedClaim)

  claims.update(currClaims => {
    currClaims.push(claim)
    return currClaims
  })

  stop(item.id)
}

export async function getClaim(itemId) {
  start(itemId)

  const claim = await GET(`claims/${id}`)

  stop(itemId)
  
  return claim
}

/**
 *
 * @description a function to update a claim
 * @export
 * @param {String} claimId
 * @param {Object} newClaimData
 */
export async function updateClaim(claimId, newClaimData) {
  start(claimId)

  //TODO make sure these properties are what is used in update claim form when it exists
  const parsedData = {
    event_date: newClaimData.event_date,
    event_type: newClaimData.event_type, //TODO will get types from future GET /config endpoint
    event_description: newClaimData.event_description,
  }

  const updatedClaim = await UPDATE(`claims/${claimId}`, parsedData)

  claims.update(currClaims => {
    let i = currClaims.findIndex(clm => clm.id === claimId)
    currClaims[i] = updatedClaim
    return currClaims
  })

  stop(claimId)

  return updatedClaim
}

export async function claimsFileAttach(claimId, fileId) {
  start(fileId)

  await CREATE(`claims/${claimId}/files`, { "file_id": fileId })

  stop(fileId)
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
