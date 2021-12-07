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
  title: 'Approved',
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
  Revision: warning,
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
  Review3: { ...pendingClaim, title: 'Awaiting review 3/3' },
  ReceiptSecondary: warning,
  Receipt: { ...approved, icon: 'done' },
  Paid: {
    ...approved,
    title: 'Complete',
  },
}

export const adminClaimStates: { [stateName: string]: State } = {
  ...claimStates,
  Review1: needsReview,
  Review2: { ...needsReview, title: 'Needs receipt review' },
  Review3: { ...needsReview, title: 'Needs final claim review' },
  Revision: { ...pending, title: 'Awaiting changes' },
  Receipt: { ...pending, icon: 'check_circle', title: 'Approved' },
  ReceiptSecondary: { ...pending, title: 'Awaiting changes' },
  Approved: { ...pending, title: 'Approved for payout', icon: 'paid' },
}

export const itemStates: { [stateName: string]: State } = {
  ...commonStates,
  Approved: approved,
  Inactive: { ...pending, title: 'This item has no coverage', icon: 'umbrella' },
  Pending: { ...pending, title: 'Awaiting item coverage review' },
}
export const adminItemStates: { [stateName: string]: State } = {
  ...itemStates,
  Revision: { ...pending, title: 'Awaiting changes' },
  Pending: { ...needsReview, title: 'Needs item coverage review' },
}

export const getClaimState = (status: ClaimStatus, isAdmin = false): State => {
  if (isAdmin) {
    adminClaimStates[status] === undefined &&
      console.error('No such state (for claim status):', status, Object.keys(adminClaimStates))

    return adminClaimStates[status] || ({} as State)
  } else {
    claimStates[status] === undefined &&
      console.error('No such state (for claim status):', status, Object.keys(claimStates))

    return claimStates[status] || ({} as State)
  }
}

export const getItemState = (status: ItemCoverageStatus, isAdmin = false): State => {
  if (isAdmin) {
    adminItemStates[status] === undefined &&
      console.error('No such state (for item status):', status, Object.keys(adminItemStates))

    return adminItemStates[status] || ({} as State)
  } else {
    itemStates[status] === undefined &&
      console.error('No such state (for item status):', status, Object.keys(itemStates))

    return itemStates[status] || ({} as State)
  }
}
