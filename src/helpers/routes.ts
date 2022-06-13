/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import qs from 'qs'

export const ROOT = '/'
export const HOME = '/home'
export const LOGOUT = '/logout'
export const LOGGEDOUT = '/logged-out'

export const ADMIN_HOME = '/admin/home'
export const ADMIN_POLICIES = '/admin/policies'
export const adminPolicySearch = (query: string) => `/admin/policies?${query}`

export const CHAT = '/chat'

export const CLAIMS = '/claims'
export const customerClaims = (policyId: string) => `/policies/${policyId}/claims`
export const customerClaimsNew = (policyId: string) => `/policies/${policyId}/claims/new`
export const customerClaimDetails = (policyId: string, claimId: string) => `/policies/${policyId}/claims/${claimId}`
export const customerClaimEdit = (policyId: string, claimId: string) => `/policies/${policyId}/claims/${claimId}/edit`

export const FAQ = '/faq'

export const ITEMS = '/items'
export const items = (policyId: string) => `/policies/${policyId}/items`
export const itemsNew = (policyId: string) => `/policies/${policyId}/items/new`
export const itemsNewQs = (policyId: string, itemId: string) =>
  `/policies/${policyId}/items/new?${qs.stringify({ itemId })}`
export const itemsCheckout = (policyId: string, itemId: string) => `/policies/${policyId}/items/${itemId}/checkout`
export const itemDetails = (policyId: string, itemId: string) => `/policies/${policyId}/items/${itemId}`
export const itemEdit = (policyId: string, itemId: string) => `/policies/${policyId}/items/${itemId}/edit`
export const itemNewClaim = (policyId: string, itemId: string) => `/policies/${policyId}/items/${itemId}/new-claim`
export const itemRemoveCoverage = (policyId: string, itemId: string) =>
  `/policies/${policyId}/items/${itemId}/remove-coverage`

export const POLICIES = '/admin/policies'
export const policyDetails = (policyId: string) => `/policies/${policyId}`
export const POLICY_NEW_TEAM = '/policies/new'

export const REPORTS = '/admin/reports'
export const reportDetails = (reportId: string) => `${REPORTS}/${reportId}`
export const policyReportDetails = (policyId: string, month: string, year: string): string =>
  `/policies/${policyId}/report?${qs.stringify({ month, year })}`

export const SETTINGS = '/settings'
export const SETTINGS_PERSONAL = '/settings/personal'
export const settingsPolicy = (policyId: string) => `/policies/${policyId}/settings`
export const householdSettingsDependent = (policyId: string, dependentId: string) =>
  `/policies/${policyId}/settings/dependents/${dependentId}`
export const householdSettingsNewDependent = (policyId: string) => `/policies/${policyId}/settings/dependents/new`

export const TERMS_OF_SERVICE = '/terms'
export const PRIVACY_POLICY = '/privacy'

export const COVER_EMAIL_HREF = 'mailto:cover@sil.org'
