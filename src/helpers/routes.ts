/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ROOT = '/'
export const HOME = '/home'
export const LOGOUT = '/logout'

export const CHAT = '/chat'

export const CUSTOMER_HOME = '/customer/home'
export const CUSTOMER_CLAIMS = '/customer/claims'
export const CUSTOMER_CLAIMS_NEW = '/customer/claims/newClaim'
export const customerClaim = (claimId: string) => `/customer/claims/${claimId}`
export const customerClaimEdit = (claimId: string) => `/customer/claims/${claimId}/edit`
export const customerPolicy = (policyId: string) => `/customer/home/${policyId}`

export const FAQ = '/faq'

export const ITEMS = '/items'
export const ITEMS_NEW = '/items/new'
export const item = (itemId: string) => `/items/${itemId}`
export const itemEdit = (itemId: string) => `/items/${itemId}/edit`
export const itemNewClaim = (itemId: string) => `/items/${itemId}/new-claim`
export const itemRemoveCoverage = (itemId: string) => `/items/${itemId}/remove-coverage`

export const POLICIES = '/policies'
export const policy = (policyId: string) => `/policies/${policyId}`

export const SETTINGS = '/settings'
export const SETTINGS_PERSONAL = '/settings/personal'
export const SETTINGS_HOUSEHOLD = '/settings/household'
export const householdSettingsDependent = (dependentId: string) => `/settings/household/dependent/${dependentId}`
