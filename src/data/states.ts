import type { ClaimStatus } from './claims'
import type { ItemCoverageStatus } from './items'

export type Status = ClaimStatus | ItemCoverageStatus

export type State = {
  icon: string
  color: string
  bgColor: string
  title: string
}
export const approved = {
  icon: 'paid',
  color: '--mdc-theme-status-success',
  bgColor: '--mdc-theme-status-success-bg',
}

export const pending: State = {
  icon: 'watch_later',
  color: '--mdc-theme-neutral-variant',
  bgColor: '--mdc-theme-neutral-bg',
  title: 'Awaiting',
}

export const warning: State = {
  icon: 'error',
  color: '--mdc-theme-status-warning',
  bgColor: '--mdc-theme-status-warning-bg',
  title: 'Needs changes',
}

export const commonStates: { [stateName: string]: State } = {
  Draft: {
    icon: 'edit',
    color: '--mdc-theme-primary',
    bgColor: '--mdc-theme-primary-header-bg',
    title: 'Draft',
  },
  Pending: pending,
  Denied: {
    icon: 'remove_circle',
    color: '--mdc-theme-status-error',
    bgColor: '--mdc-theme-status-error-bg',
    title: 'Denied',
  },
}

export const claimStates: { [stateName: string]: State } = {
  ...commonStates,
  Approved: { ...approved, title: 'Approved for payout' },
  Draft2: warning,
  Review1: pending,
  Review2: pending,
  Review3: pending,
  Receipt2: warning,
  Receipt: {
    icon: 'done',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: 'Approved',
  },
  Revision: {
    icon: 'chat',
    color: '--mdc-theme-primary',
    bgColor: '--mdc-theme-primary-header-bg',
    title: '',
  },
  Paid: {
    icon: 'paid',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: 'Complete',
  },
}

export const itemStates: { [stateName: string]: State } = {
  ...commonStates,
  Approved: { ...approved, title: 'Approved' },
}

export const getClaimState = <ClaimStatus>(status: string) => getAppropriateState(claimStates, status)

export const getItemState = <ItemCoverageStatus>(status: string) => getAppropriateState(itemStates, status)

const getAppropriateState = <State>(states: Status, status: Status) => {
  if (states[status] === undefined) {
    console.error('No such state (for claim/item status):', status, Object.keys(states))
  }
  return states[status] || ({} as State)
}
