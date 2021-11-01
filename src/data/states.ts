import type { ClaimStatus } from './claims'
import type { ItemCoverageStatus } from './items'

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

export const needsReview: State = {
  icon: 'assignment',
  color: '--mdc-theme-primary',
  bgColor: '--mdc-theme-primary-header-bg',
  title: 'Needs claim review',
}

export const pending: State = {
  icon: 'watch_later',
  color: '--mdc-theme-neutral-variant',
  bgColor: '--mdc-theme-neutral-bg',
  title: '',
}

export const pendingClaim: State = {
  ...pending,
  title: 'Awaiting claim review',
}

export const warning: State = {
  icon: 'error',
  color: '--mdc-theme-status-warning',
  bgColor: '--mdc-theme-status-warning-bg',
  title: 'Needs changes',
}

export const commonStates: { [stateName: string]: State } = {
  Denied: {
    icon: 'remove_circle',
    color: '--mdc-theme-status-error',
    bgColor: '--mdc-theme-status-error-bg',
    title: 'Denied',
  },
  Revision: {
    ...pending,
    title: 'Awaiting changes',
  },
  Draft: {
    icon: 'edit',
    color: '--mdc-theme-primary',
    bgColor: '--mdc-theme-primary-header-bg',
    title: 'Draft',
  },
}

export const claimStates: { [stateName: string]: State } = {
  ...commonStates,
  Approved: { ...approved, title: 'Approved for payout' },
  DraftSecondary: warning,
  Review1: pendingClaim,
  Review2: pendingClaim,
  Review3: pendingClaim,
  ReceiptSecondary: warning,
  Receipt: {
    icon: 'done',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: 'Approved',
  },
  Paid: {
    icon: 'paid',
    color: '--mdc-theme-status-success',
    bgColor: '--mdc-theme-status-success-bg',
    title: 'Complete',
  },
}

export const adminClaimStates: { [stateName: string]: State } = {
  ...claimStates,
  Review1: needsReview,
  Review2: needsReview,
  Review3: { ...needsReview, title: 'Needs final claim review' },
  Revision: { ...pending, title: 'Needs changes' },
  Receipt: { ...pending, icon: 'check_circle', title: 'Approved' },
  ReceiptSecondary: { ...pending, title: 'Needs changes' },
  Approved: { ...pending, title: 'Approved for payout', icon: 'paid' },
}

export const itemStates: { [stateName: string]: State } = {
  ...commonStates,
  Approved: { ...approved, title: 'Approved' },
  Inactive: { ...pending, title: 'This item has no coverage', icon: 'umbrella' },
  Pending: { ...pending, title: 'Awaiting item coverage review' },
}

export const getClaimState = (status: ClaimStatus, isAdmin = false): State => {
  if (claimStates[status] === undefined && adminClaimStates[status] === undefined) {
    console.error('No such state (for claim status):', status, Object.keys({ ...claimStates, ...adminClaimStates }))
  }
  if (isAdmin) {
    return adminClaimStates[status] || ({} as State)
  } else {
    return claimStates[status] || ({} as State)
  }
}

export const getItemState = (status: ItemCoverageStatus): State => {
  if (itemStates[status] === undefined) {
    console.error('No such state (for claim/item status):', status, Object.keys(itemStates))
  }
  return (itemStates[status] || {}) as State
}
