import { categories } from 'data/itemCategories'
import { ItemCoverageStatus, type PolicyItem, type NewItemFormData, type UpdateItemFormData } from 'data/items'
import { assertHas, assertIsFourDigitYear, assertIsLessOrEqual } from '../../../validation/assertions'
import { get } from 'svelte/store'

export const areMakeAndModelRequired = (item: PolicyItem, categoryId: string): boolean | undefined => {
  return (
    item.coverage_status !== ItemCoverageStatus.Approved &&
    get(categories).find((category) => category.id === categoryId)?.require_make_model
  )
}

export const assembleStatementNameDefault = (make: string, model: string, year: number | undefined, uniqueIdentifier: string) => {
  const consecutiveSpaces = / {2,}/
  const combinedValues = `${make} ${model} ${year || ''} ${uniqueIdentifier.slice(-6)}`
  return combinedValues.trim().replace(consecutiveSpaces, ' ')
}

export const validateForSave = (formData: NewItemFormData | UpdateItemFormData): void => {
  assertHas(formData.accountablePersonId, 'Please indicate who will be responsible for the item')
  assertHas(formData.categoryId, 'Please select a category')
  assertHas(formData.name, 'Please specify a statement name')
}

export const validateForSubmit = (item: PolicyItem, formData: NewItemFormData | UpdateItemFormData, isVehicle: boolean): void => {
  validateForSave(formData)
  assertIsLessOrEqual(0.01, Number(formData.coverageAmountUSD), 'Please specify the coverage value')
  item.coverage_status !== ItemCoverageStatus.Draft &&
    assertIsLessOrEqual(
      Number(formData.coverageAmountUSD) * 100,
      item.coverage_amount,
      'Coverage amount cannot be increased'
    )
  if (isVehicle) {
    assertIsFourDigitYear(
      formData.year,
      "Please enter the vehicle's model year, e.g., 1995 (all four digits)"
    )
  }
}
