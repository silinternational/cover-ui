import type { ClaimStatus } from './claims'
import type { ItemCoverageStatus } from './items'

export type Status = ClaimStatus | ItemCoverageStatus
export type State = {
  icon: string
  color: string
  bgColor: string
  title: string
}

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

export const getState = <State>(status: Status) => {
  if (states[status] === undefined) {
    console.error('No such state (for claim status):', status, Object.keys(states))
  }
  return states[status || 'Message']
}
