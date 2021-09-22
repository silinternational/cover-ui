import type { ClaimStatus } from './claims'
import type { ItemCoverageStatus } from './items'

export type Status = ClaimStatus | ItemCoverageStatus
export type Title = {
  claim: string
  item: string | null
}
export type State = {
  icon: string
  color: string
  bgColor: string
  title: Title
}

export const warning: State = {
  icon: 'error',
  color: '--mdc-theme-status-warning',
  bgColor: '--mdc-theme-status-warning-bg',
  title: { claim: 'Needs changes', item: 'Needs changes' },
}
export const success: State = {
  icon: 'done',
  color: '--mdc-theme-status-success',
  bgColor: '--mdc-theme-status-success-bg',
  title: { claim: 'Approved for repair', item: 'Approved' },
}
export const pending: State = {
  icon: 'watch_later',
  color: '--mdc-theme-neutral-variant',
  bgColor: '--mdc-theme-neutral-bg',
  title: { claim: 'Awaiting review', item: null },
}
export const states: { [stateName: string]: State } = {
  Revision: {
    icon: 'chat',
    color: '--mdc-theme-primary',
    bgColor: '--mdc-theme-primary-header-bg',
    title: { claim: '', item: null },
  },
  Draft: {
    icon: 'edit',
    color: '--mdc-theme-primary',
    bgColor: '--mdc-theme-primary-header-bg',
    title: { claim: 'Draft', item: 'Draft' },
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
    title: { claim: 'Denied', item: 'Denied' },
  },
  Approved: {
    icon: 'paid',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: { claim: 'Approved for payout', item: 'Approved' },
  },
  Paid: {
    icon: 'paid',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: { claim: 'Complete', item: null },
  },
}

export const getState = <State>(status: string) => {
  if (states[status] === undefined) {
    console.error('No such state (for claim status):', status, Object.keys(states))
  }
  return states[status || 'Message']
}
