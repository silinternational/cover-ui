import { categories } from 'data/itemCategories'
import { ItemCoverageStatus, PolicyItem, NewItemFormData, UpdateItemFormData } from 'data/items'
import { assertHas, assertIsLessOrEqual } from '../../../validation/assertions'
import { get } from 'svelte/store'

export const areMakeAndModelRequired = (item: PolicyItem, categoryId: string): boolean | undefined => {
  return (
    item.coverage_status !== ItemCoverageStatus.Approved &&
    get(categories).find((category) => category.id === categoryId)?.require_make_model
  )
}

export const assembleStatementNameDefault = (make: string, model: string, year: string, uniqueIdentifier: string) => {
  const consecutiveSpaces = / {2,}/
  return `${make} ${model} ${year} ${uniqueIdentifier.slice(-6)}`.trim().replace(consecutiveSpaces, ' ')
}

export const validateForSave = (formData: NewItemFormData | UpdateItemFormData): void => {
  assertHas(formData.accountablePersonId, 'Please indicate who will be responsible for the item')
  assertHas(formData.categoryId, 'Please select a category')
  assertHas(formData.name, 'Please specify a statement name')
}

export const validateForSubmit = (item: PolicyItem, formData: NewItemFormData | UpdateItemFormData): void => {
  validateForSave(formData)
  assertIsLessOrEqual(0.01, Number(formData.marketValueUSD), 'Please specify the market value')
  item.coverage_status !== ItemCoverageStatus.Draft &&
    assertIsLessOrEqual(
      Number(formData.marketValueUSD) * 100,
      item.coverage_amount,
      'Coverage amount cannot be increased'
    )
}
