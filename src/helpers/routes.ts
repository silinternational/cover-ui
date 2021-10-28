/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { AdminAppRole } from '../authn/user'

export const ROOT = '/'
export const HOME = '/home'
export const LOGOUT = '/logout'

export const adminRoleHome = (role: AdminAppRole) => `/${role.toLowerCase()}/home`

export const CHAT = '/chat'

export const CUSTOMER_HOME = '/customer/home'

export const customerClaims = (policyId: string) => `/policies/${policyId}/claims`
export const customerClaimsNew = (policyId: string) => `/policies/${policyId}/claims/new`
export const customerClaimDetails = (policyId: string, claimId: string) => `/policies/${policyId}/claims/${claimId}`
export const customerClaimEdit = (policyId: string, claimId: string) => `/policies/${policyId}/claims/${claimId}/edit`

export const FAQ = '/faq'

export const items = (policyId: string) => `/policies/${policyId}/items`
export const itemsNew = (policyId: string) => `/policies/${policyId}/items/new`
export const itemDetails = (policyId: string, itemId: string) => `/policies/${policyId}/items/${itemId}`
export const itemEdit = (policyId: string, itemId: string) => `/policies/${policyId}/items/${itemId}/edit`
export const itemNewClaim = (policyId: string, itemId: string) => `/policies/${policyId}/items/${itemId}/new-claim`
export const itemRemoveCoverage = (policyId: string, itemId: string) =>
  `/policies/${policyId}/items/${itemId}/remove-coverage`

export const POLICIES = '/policies'
export const policyDetails = (policyId: string) => `/policies/${policyId}`
export const policyHome = (policyId: string) => `/policies/${policyId}/home`
export const POLICY_NEW_CORPORATE = '/policies/new'

export const SETTINGS = '/settings'
export const SETTINGS_PERSONAL = '/settings/personal'
export const SETTINGS_HOUSEHOLD = '/settings/household'
export const householdSettingsDependent = (dependentId: string) => `/settings/household/dependent/${dependentId}`

export const TERMS = '/terms-of-service'
