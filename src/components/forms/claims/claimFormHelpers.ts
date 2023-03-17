import type { ClaimFormData } from './types'
import { assertHas } from '../../../validation/assertions'

export const validateForm = (
  { claimData, claimItemData }: ClaimFormData,
  potentiallyRepairable: boolean,
  repairableSelection?: string,
  needsPayoutOption?: boolean
): void => {
  assertHas(claimItemData.itemId, 'Please select an item')
  assertHas(claimData.lossReason, 'Please select a reason for loss or damage')
  assertHas(claimData.situationDescription, 'Please describe the situation')
  potentiallyRepairable && assertHas(repairableSelection, 'Please specify if the item is repairable')
  if (claimItemData.isRepairable) {
    assertHas(claimItemData.repairEstimateUSD, 'Please enter a repair estimate')
    assertHas(claimItemData.fairMarketValueUSD, 'Please enter a fair market value')
  }
  needsPayoutOption && assertHas(claimItemData.payoutOption, 'Please select a payout option')
}

export const validateFormOnSave = (itemId: string, lossReason: string, situationDescription: string): void => {
  assertHas(itemId, 'Please select an item')
  assertHas(lossReason, 'Please select a loss reason')
  assertHas(situationDescription, 'Please enter a description')
}

export const validateFormOnContinue = (
  repairEstimateUSD: number | undefined,
  fairMarketValueUSD: number | undefined,
  isRepairable: boolean | undefined
): void => {
  if (isRepairable) {
    assertHas(repairEstimateUSD, 'Please enter a repair estimate')
  }
  assertHas(fairMarketValueUSD, 'Please enter a fair market value')
}
