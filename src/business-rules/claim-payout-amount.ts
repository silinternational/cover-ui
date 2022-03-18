import type { ClaimIncidentType } from 'data/types/claim-incident-types'
import { PayoutOption, ClaimItem, ClaimStatus, ClaimFilePurpose } from 'data/claims'

export const LOSS_REASON_EVACUATION = 'Evacuation'

export const isFairMarketValueNeeded = (isRepairable?: boolean, payoutOption?: string): boolean => {
  return isRepairable || payoutOption === PayoutOption.FMV
}

export const isPotentiallyRepairable = (claimIncidentTypes: ClaimIncidentType[], incidentTypeName: string): boolean => {
  if (!incidentTypeName) {
    return true
  }
  if (claimIncidentTypes.length < 1) {
    return true
  }
  const repairableIncidentTypes = claimIncidentTypes.filter((type) => type.is_repairable)
  return repairableIncidentTypes.some((type) => type.name === incidentTypeName)
}

export const isRepairCostTooHigh = (repairEstimateUSD?: number, fairMarketValueUSD?: number): boolean | undefined => {
  if (!repairEstimateUSD) {
    return undefined
  }
  if (!fairMarketValueUSD) {
    return undefined
  }
  const seventyPercentFMV = 0.7 * fairMarketValueUSD
  return repairEstimateUSD >= seventyPercentFMV
}

export const isUnrepairableOrTooExpensive = (
  isRepairable?: boolean,
  repairCostIsTooHigh?: boolean
): boolean | undefined => {
  if (isRepairable === false) {
    return true
  }

  if (isRepairable === undefined || repairCostIsTooHigh === undefined) {
    return undefined
  }

  return repairCostIsTooHigh
}

export const isEvidenceNeeded = (claimItem: ClaimItem, claimStatus: ClaimStatus): boolean => {
  const willNeedEvidence = claimItem.fmv > 0 || claimItem.repair_estimate > 0
  const repairCostIsNotTooHigh = !isRepairCostTooHigh(claimItem.repair_estimate, claimItem.fmv)
  const canProvideEvidenceNow = [ClaimStatus.Draft].includes(claimStatus)
  return willNeedEvidence && repairCostIsNotTooHigh && canProvideEvidenceNow
}

export const getFilePurpose = (claimItem: ClaimItem, needsReceipt: boolean): ClaimFilePurpose | '' => {
  if (needsReceipt) return 'Receipt'
  else if (claimItem.repair_estimate) return 'Repair Estimate'
  else if (claimItem.fmv) return 'Evidence of FMV'
  else return ''
}

export const getUploadLabel = (
  claimItem: ClaimItem,
  needsReceipt: boolean,
  receiptType: string,
  longLabel = true
): string => {
  if (needsReceipt) return longLabel ? `a ${receiptType} item receipt` : 'receipt'
  else if (claimItem.repair_estimate) return longLabel ? 'a repair estimate' : 'estimate'
  else if (claimItem.fmv) return longLabel ? 'evidence of fair market value' : 'evidence'
  else return ''
}
