import { CREATE, DELETE, GET, UPDATE } from '.'
import { throwError } from '../error'
import { convertToCents } from 'helpers/money'
import type { ItemCategory } from './itemCategories'
import { selectedPolicyId } from './role-policy-selection'
import { derived, get, writable } from 'svelte/store'

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

/**
 * The day of the month before which monthly coverage can start in the current
 * month. See corresponding `MonthlyCutoffDay` constant in cover-api here:
 * https://github.com/silinternational/cover-api/blob/develop/application/models/item.go
 */
export const MonthlyCutoffDay = 20

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

export const itemsByPolicyId = writable<{ [policyId: string]: PolicyItem[] }>({})
export const allPolicyItems = derived(itemsByPolicyId, ($itemsByPolicyId) => {
  return Object.values($itemsByPolicyId).flat()
})
export const selectedPolicyItems = derived(
  [itemsByPolicyId, selectedPolicyId],
  ([$itemsByPolicyId, $selectedPolicyId]) => {
    return $itemsByPolicyId[$selectedPolicyId] || []
  },
)

/**
 * Load the items for the specified policy.
 *
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 */
export async function loadItems(policyId: string): Promise<void> {
  const urlPath = `policies/${policyId}/items`

  const items = await GET<PolicyItem[]>(urlPath)
  itemsByPolicyId.update((data) => {
    // TODO: Sorting and filtering should really be done on the BE but that's not supported yet
    items.sort((a, b) => Number(new Date(b.updated_at)) - Number(new Date(a.updated_at)))
    data[policyId] = items
    return data
  })
}

/**
 * Add an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {Object} itemData
 * @return {Object}
 */
export async function addItem(policyId: string, itemData: NewItemFormData): Promise<PolicyItem> {
  const urlPath = `policies/${policyId}/items`

  const parsedItemData: CreatePolicyItemRequestBody = {
    accountable_person_id: itemData.accountablePersonId,
    category_id: itemData.categoryId,
    country: itemData.country,
    coverage_amount: convertToCents(itemData.coverageAmountUSD),
    coverage_status: itemData.coverageStatus,
    description: itemData.itemDescription,
    in_storage: itemData.inStorage,
    make: itemData.make,
    model: itemData.model,
    name: itemData.name,
    serial_number: itemData.uniqueIdentifier,
    year: itemData.year,
  }

  const addedItem = await CREATE<PolicyItem>(urlPath, parsedItemData as any)

  itemsByPolicyId.update((data) => {
    const items = data[policyId] || []
    items.push(addedItem)
    data[policyId] = items
    return data
  })

  return addedItem
}

export async function approveItem(itemId: string): Promise<PolicyItem> {
  const urlPath = `items/${itemId}/approve`

  const updatedItem = await CREATE<PolicyItem>(urlPath)

  updateStoreItem(updatedItem)

  return updatedItem
}

export async function denyItem(itemId: string, status_reason: string): Promise<PolicyItem> {
  const urlPath = `items/${itemId}/deny`
  const data = { status_reason }

  const updatedItem = await CREATE<PolicyItem>(urlPath, data)

  updateStoreItem(updatedItem)

  return updatedItem
}

export async function reviseItem(itemId: string, status_reason: string): Promise<PolicyItem> {
  const urlPath = `items/${itemId}/revision`
  const data = { status_reason }

  const updatedItem = await CREATE<PolicyItem>(urlPath, data)

  updateStoreItem(updatedItem)

  return updatedItem
}

/**
 * Submit an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} itemId -- The UUID for the applicable policy item
 * @return {Object}
 */
export async function submitItem(itemId: string): Promise<void> {
  const urlPath = `items/${itemId}/submit`

  const response = await CREATE<PolicyItem>(urlPath)

  updateStoreItem(response)
}

/**
 * Update an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} itemId -- The UUID for the applicable policy item
 * @param {Object} itemData
 * @return {Object}
 */
export async function updateItem(policyId: string, itemId: string, itemData: UpdateItemFormData): Promise<void> {
  if (!itemId) {
    throwError('item id not set')
  }
  const urlPath = `items/${itemId}`

  const parsedItemData: UpdatePolicyItemRequestBody = {
    accountable_person_id: itemData.accountablePersonId,
    category_id: itemData.categoryId,
    country: itemData.country,
    coverage_amount: convertToCents(itemData.coverageAmountUSD),
    description: itemData.itemDescription,
    in_storage: itemData.inStorage,
    make: itemData.make,
    model: itemData.model,
    name: itemData.name,
    risk_category_id: itemData.riskCategoryId,
    serial_number: itemData.uniqueIdentifier,
    year: itemData.year,
  }
  const updatedItem = await UPDATE<PolicyItem>(urlPath, parsedItemData)

  itemsByPolicyId.update((data) => {
    const items = data[policyId] || []
    const i = items.findIndex((item) => item.id === itemId)
    if (i === -1) {
      throwError('Failed to find local item to update it')
    }
    items[i] = updatedItem
    data[policyId] = items
    return data
  })
}

/**
 * Delete an item.
 *
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} itemId -- The UUID for the item to delete
 */
export async function deleteItem(policyId: string, itemId: string): Promise<any> {
  const urlPath = `items/${itemId}`

  await DELETE(urlPath)

  itemsByPolicyId.update((data) => {
    const items = data[policyId] || []
    data[policyId] = items.filter((item) => item.id !== itemId)
    return data
  })
}

export const itemBelongsToPolicy = (policyId: string, item: PolicyItem): boolean => item.policy_id === policyId

export const getItemsAccountablePersonIsOn = (accountablePersonId: string, policyId: string): PolicyItem[] => {
  return get(itemsByPolicyId)[policyId]?.filter((item) => item.accountable_person?.id === accountablePersonId) || []
}

export const howManyItemsAccountablePersonIsOn = (accountablePersonId: string, policyId: string): number => {
  return getItemsAccountablePersonIsOn(accountablePersonId, policyId).length
}

function updateStoreItem(updatedItem: PolicyItem) {
  itemsByPolicyId.update((data) => {
    const items = data[updatedItem.policy_id] || []
    const itemIndex = items.findIndex((item) => item.id === updatedItem.id)
    items[itemIndex] = updatedItem
    data[updatedItem.policy_id] = items
    return data
  })
}

export const cloneItems = (itemsArray: PolicyItem[], policyId: string): void => {
  itemsArray?.forEach((item) => addItem(policyId, parseItemForAddItem(item)))
  itemsArray = []
}

export const deleteItems = (itemsArray: PolicyItem[], policyId: string): void => {
  itemsArray?.forEach((item) => deleteItem(policyId, item.id))
}

export const itemIsNotInactive = (item: PolicyItem): boolean => {
  return item.coverage_status !== ItemCoverageStatus.Inactive
}

export const itemIsApproved = (item: PolicyItem): boolean => {
  return item.coverage_status === ItemCoverageStatus.Approved
}

export const itemIsDraft = (item: PolicyItem): boolean => {
  return item.coverage_status === ItemCoverageStatus.Draft
}

export const itemIsInactive = (item: PolicyItem): boolean => {
  return item.coverage_status === ItemCoverageStatus.Inactive
}

export const itemIsPending = (item: PolicyItem): boolean => {
  return item.coverage_status === ItemCoverageStatus.Pending
}

export const assignItems = async (
  newMemberId: string,
  policyId: string,
  selectedPolicyMemberId: string,
): Promise<void> => {
  const promises = []
  const items = getItemsAccountablePersonIsOn(selectedPolicyMemberId, policyId)
  for (const item of items) {
    promises.push(
      updateItem(policyId, item.id, {
        categoryId: item.category.id,
        accountablePersonId: newMemberId,
        coverageAmountUSD: item.coverage_amount / 100,
        itemDescription: item.description,
        inStorage: item.in_storage,
        make: item.make,
        model: item.model,
        name: item.name,
        riskCategoryId: item.risk_category.id,
        uniqueIdentifier: item.serial_number,
      }),
    )
  }

  await Promise.all(promises)
}

export const parseItemForAddItem = (item: PolicyItem): NewItemFormData => {
  return {
    accountablePersonId: item.accountable_person.id,
    categoryId: item.category.id,
    country: item.country || item.accountable_person.country,
    coverageAmountUSD: item.coverage_amount / 100,
    itemDescription: item.description,
    inStorage: item.in_storage,
    make: item.make,
    model: item.model,
    name: item.name,
    riskCategoryId: item.risk_category.id,
    uniqueIdentifier: item.serial_number,
  }
}

export const getUneditableItems = (items: PolicyItem[]): PolicyItem[] => {
  return items.filter((item) => {
    return item.can_be_updated === false
  })
}
