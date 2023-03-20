import type { ClaimFormData } from './types'
import { assertHas } from '../../../validation/assertions'

export const validateForFinalSubmission = (
  { claimData, claimItemData }: ClaimFormData,
  potentiallyRepairable: boolean,
  repairableSelection?: string,
  needsPayoutOption?: boolean
): void => {
  validateForDraft(claimItemData.itemId, claimData.lossReason)
  assertHas(claimData.situationDescription, 'Please describe the situation')
  potentiallyRepairable && assertHas(repairableSelection, 'Please specify if the item is repairable')
  if (claimItemData.isRepairable) {
    assertHas(claimItemData.repairEstimateUSD, 'Please enter a repair estimate')
    assertHas(claimItemData.fairMarketValueUSD, 'Please enter a fair market value')
  }
  needsPayoutOption && assertHas(claimItemData.payoutOption, 'Please select a payout option')
}

export const validateForDraft = (itemId: string, lossReason: string): void => {
  assertHas(itemId, 'Please select an item')
  assertHas(lossReason, 'Please select a reason for loss or damage')
}

export const validateFormOnContinue = (
  repairEstimateUSD: number | undefined,
  fairMarketValueUSD: number | undefined,
  isRepairable: boolean | undefined,
  situationDescription: string
): void => {
  if (isRepairable) {
    assertHas(repairEstimateUSD, 'Please enter a repair estimate')
  }
  assertHas(situationDescription, 'Please describe the situation')
  assertHas(fairMarketValueUSD, 'Please enter a fair market value')
}
