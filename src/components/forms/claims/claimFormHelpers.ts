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
