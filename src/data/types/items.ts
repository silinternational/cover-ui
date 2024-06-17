import type { ItemCategory } from 'data/itemCategories'

export enum BillingPeriod {
  Monthly = 1,
  Yearly = 12,
}

export enum ItemCoverageStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Approved = 'Approved',
  Denied = 'Denied',
  Revision = 'Revision',
  Inactive = 'Inactive',
}

export const editableCoverageStatuses = [
  ItemCoverageStatus.Approved,
  ItemCoverageStatus.Draft,
  ItemCoverageStatus.Pending,
  ItemCoverageStatus.Revision,
]

export const incompleteItemCoverageStatuses = [
  ItemCoverageStatus.Draft,
  ItemCoverageStatus.Pending,
  ItemCoverageStatus.Revision,
]

export type AccountablePerson = {
  id: string
  name: string
  country: string
}
export type RiskCategory = {
  created_at: string /*Date*/
  id: string
  name: RiskCategoryNames
  policy_max: number
  updated_at: string /*Date*/
}

export enum RiskCategoryNames {
  Stationary = 'Stationary',
  Mobile = 'Mobile',
  Vehicle = 'Vehicle',
}

export type PolicyItem = {
  accountable_person: AccountablePerson
  annual_premium: number
  billing_period: number /* in months, e.g. 1 or 12 */
  category: ItemCategory
  country: string
  coverage_amount: number
  coverage_end_date: string /*Date*/
  coverage_start_date: string /* yyyy-mm-dd Date */
  coverage_status: ItemCoverageStatus
  created_at: string /*Date*/
  description: string
  id: string
  in_storage: boolean
  can_be_deleted: boolean
  can_be_updated: boolean
  make: string
  model: string
  monthly_premium: number
  name: string
  policy_id: string
  prorated_annual_premium: number
  risk_category: RiskCategory
  serial_number: string
  status_change: string
  status_reason: string
  updated_at: string /*Date*/
  year?: number
}

export type CreatePolicyItemRequestBody = {
  accountable_person_id: string /*UUID*/
  category_id: string
  country?: string
  coverage_amount?: number
  coverage_status?: ItemCoverageStatus
  description?: string
  in_storage?: boolean
  make?: string
  model?: string
  name: string
  risk_category_id?: string
  serial_number?: string
  year?: number
}

export type UpdatePolicyItemRequestBody = {
  accountable_person_id: string /*UUID*/
  category_id: string
  country?: string
  coverage_amount?: number
  description?: string
  in_storage?: boolean
  make?: string
  model?: string
  name: string
  risk_category_id?: string
  serial_number?: string
  year?: number
}

export interface ItemFormData {
  accountablePersonId: string /*UUID*/
  categoryId: string
  country?: string
  coverageAmountUSD?: number | string
  itemDescription?: string
  inStorage?: boolean
  make?: string
  model?: string
  riskCategoryId?: string
  name: string
  uniqueIdentifier?: string
  year?: number
}

export interface NewItemFormData extends ItemFormData {
  coverageStatus?: ItemCoverageStatus
}

export interface UpdateItemFormData extends ItemFormData {
  isAutoSaving?: boolean
}
