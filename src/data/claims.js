import { CREATE, GET } from "."
import { start, stop } from "../components/progress"
import { writable } from "svelte/store"

export const claims = writable([])
export const initialized = writable(true)
export const states = {
  message: {
      icon: 'chat',
      color: '--mdc-theme-primary',
      bgColor: '--mdc-theme-primary-header-bg',
      title: 'From '
  },
  draft: {
      icon: 'edit',
      color: '--mdc-theme-primary',
      bgColor: '--mdc-theme-primary-header-bg',
      title: 'Draft'
  },
  awaiting: {
      icon: 'watch_later',
      color: '--mdc-theme-neutral-variant',
      bgColor: '--mdc-theme-neutral-bg',
      title: 'Awaiting review'
  },
  needsChanges: {
      icon: 'error',
      color: '--mdc-theme-status-warning',
      bgColor: '--mdc-theme-status-warning-bg',
      title: 'Needs changes'
  },
  denied: {
      icon: 'remove_circle',
      color: '--mdc-theme-status-error',
      bgColor: '--mdc-theme-status-error-bg',
      title: 'Denied'
  },
  approvedRepair: {
      icon: 'done',
      color: '--mdc-theme-status-success',
      bgColor: '--mdc-theme-status-success-bg',
      title: 'Approved for repair'
  },
  payout: {
      icon: 'paid',
      color: '--mdc-theme-status-success',
      bgColor: '--mdc-theme-status-success-bg',
      title: 'Approved for payout'
  },
  complete: {
      icon: 'paid',
      color: '--mdc-theme-status-success',
      bgColor: '--mdc-theme-status-success-bg',
      title: 'Complete'
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

  let claim = await GET(`claims/${id}`)

  stop(itemId)
  
  return claim
}

/**
 *
 * @description a function to update a claim
 * @export
 * @param {Number} itemId
 * @param {Object} newClaimData
 */
export function updateClaim(itemId, newClaimData) {
  start(itemId)

  newClaimData.itemId = itemId

  claims.update(currClaims => {
    let i = currClaims.findIndex(clm => clm.itemId === itemId)
    currClaims[i] = newClaimData
    return currClaims
  })

  stop(itemId)
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
  start()

  let clms = await GET('claims')

  claims.set(clms)

  stop()
  initialized.set(true)
}

export const getState = item => states[item.state || 'message']